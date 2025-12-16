from quiz.interfaces.IQuizRepository import IQuizRepository
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from teams.service.TeamService import TeamService 
from shared.database import QuizResultTable, UserTable 
from quiz.schemas.metrics_schema import QuizMetricsViewModel, GlobalRankingViewModel
from sqlalchemy import func, desc
from fastapi import HTTPException, status
from typing import List, Any

# Importamos o serviço de Push Notification
from shared.notification_service import send_topic_push

class QuizService:
    def __init__(self, 
                 repository: IQuizRepository,
                 team_service: TeamService,
                 socket_manager: Any = None): # Injeção do Gerenciador de WebSocket
        self._repository = repository
        self._team_service = team_service
        self.socket_manager = socket_manager

    async def create_quiz(self, quiz_data: QuizInputModel) -> QuizViewModel:
        if not quiz_data.pergunta_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Um quiz deve ter ao menos uma pergunta."
            )
        
        if quiz_data.valor_recompensa is not None and quiz_data.valor_recompensa < 5.0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recompensa mínima é de R$ 5,00."
            )
            
        # 1. Cria o quiz no Banco (retorna objeto do banco)
        created_quiz = self._repository.create_quiz(quiz_data)
        
        # 2. Dispara as notificações (WebSocket + Firebase)
        await self.trigger_new_quiz_notification(created_quiz.id)
        
        # 3. Converte MANUALMENTE do Banco para o Schema de Resposta (A CORREÇÃO ESTÁ AQUI)
        return QuizViewModel(
            id=created_quiz.id,
            nome_quiz=created_quiz.nome_quiz,
            tema=created_quiz.tema,
            tempo_por_questao_segundos=created_quiz.tempo_por_questao_segundos,
            total_perguntas=len(quiz_data.pergunta_ids),
            valor_recompensa=created_quiz.valor_recompensa
        )

    def list_available_quizzes(self) -> List[QuizViewModel]:
        quizzes_db = self._repository.list_available_quizzes()
        # Precisamos converter a lista também, caso o repository retorne objetos do banco
        # Se o seu repository já retorna QuizViewModel, isso aqui pode ser simplificado
        # Mas assumindo que ele retorna objetos do banco:
        return [
            QuizViewModel(
                id=q.id,
                nome_quiz=q.nome_quiz,
                tema=q.tema,
                tempo_por_questao_segundos=q.tempo_por_questao_segundos,
                # Se o objeto do banco não tiver a lista de perguntas carregada, 
                # pode ser necessário ajustar o count abaixo ou garantir o load no repo
                total_perguntas=len(q.perguntas) if hasattr(q, "perguntas") else 0,
                valor_recompensa=q.valor_recompensa
            ) for q in quizzes_db
        ]
    
    def start_quiz_session(self, quiz_id: int, user_id: int):
        details = self._repository.get_quiz_details(quiz_id)
        if not details:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz não encontrado.")
        
        return {"quiz_id": quiz_id, "user_id": user_id, "status": "Sessão iniciada"}
    
    def end_quiz_admin(self, quiz_id: int) -> dict:
        """Encerrar uma sessão de quiz ativamente (RESTRITO A ADM)."""
        
        details = self._repository.get_quiz_details(quiz_id)
        if not details:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Quiz não encontrado.")
            
        success = self._repository.end_quiz_session(quiz_id)
        
        if not success:
             raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Não foi possível encerrar o quiz.")
                     
        return {"quiz_id": quiz_id, "status": "Encerrado com sucesso. Ranking finalizado."}

    def leave_quiz_session(self, quiz_id: int, user_id: int) -> dict:
        """Permite que o usuário saia da sala de espera ou do quiz."""
        return {"detail": f"Usuário {user_id} saiu do quiz {quiz_id}."}
    
    def get_global_ranking(self) -> List[GlobalRankingViewModel]:
        ranking_data = (
            self._repository._db.query(
                QuizResultTable.user_id,
                func.sum(QuizResultTable.total_score).label("total_score_general"),
                func.count(QuizResultTable.quiz_id).label("total_quizzes_played"),
                func.avg(QuizResultTable.total_time_ms).label("avg_speed_ms"),
                UserTable.name
            )
            .join(UserTable, QuizResultTable.user_id == UserTable.id)
            .group_by(QuizResultTable.user_id, UserTable.name)
            .order_by(desc("total_score_general"))
            .all()
        )
        
        return [
            GlobalRankingViewModel(
                user_id=item.user_id,
                username=item.name,
                total_score_general=item.total_score_general,
                total_quizzes_played=item.total_quizzes_played,
                avg_speed_ms=int(item.avg_speed_ms)
            )
            for item in ranking_data
        ]

    def get_quiz_metrics(self, quiz_id: int) -> QuizMetricsViewModel:
        
        results_db = (
            self._repository._db.query(QuizResultTable, UserTable.name)
            .join(UserTable, QuizResultTable.user_id == UserTable.id)
            .filter(QuizResultTable.quiz_id == quiz_id)
            .order_by(desc(QuizResultTable.total_score))
            .all()
        )
        
        if not results_db:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Nenhum resultado encontrado para este quiz.")
            
        results_view = [] 
        fastest_result = None 

        quiz_details = self._repository.get_quiz_details(quiz_id)
        
        return QuizMetricsViewModel(
            quiz_id=quiz_id,
            quiz_name=quiz_details.nome_quiz if quiz_details else f"Quiz ID {quiz_id}",
            results=results_view,
            fastest_player=fastest_result
        )

    async def trigger_new_quiz_notification(self, quiz_id: int) -> dict:
        """
        Dispara notificações híbridas:
        1. WebSocket (Para usuários com App Aberto)
        2. Firebase Cloud Messaging (Para usuários com App Fechado)
        """
        quiz_details = self._repository.get_quiz_details(quiz_id)
        if not quiz_details:
             raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Quiz não encontrado para notificação.")
        
        print(f"LOG: Iniciando fluxo de notificação para '{quiz_details.nome_quiz}'...")
        
        logs = []

        # --- 1. WebSocket Notification (App Aberto) ---
        if self.socket_manager:
            message_payload = {
                "event": "NEW_QUIZ_AVAILABLE",
                "data": {
                    "quiz_id": quiz_id,
                    "title": quiz_details.nome_quiz,
                    "reward": quiz_details.valor_recompensa
                },
                "message": f"Novo quiz disponível: {quiz_details.nome_quiz}!"
            }
            await self.socket_manager.broadcast(message_payload)
            logs.append("WebSocket Broadcast enviado.")
        else:
            logs.append("WebSocket ignorado (sem manager).")

        # --- 2. Firebase Push Notification (App Fechado) ---
        try:
            push_title = "Novo Quiz Disponível! ⚽"
            push_body = f"O quiz '{quiz_details.nome_quiz}' já está no ar. Venha jogar e ganhar pontos!"
            
            # Dados extras
            push_data = {
                "click_action": "NOTIFICATION_CLICK", 
                "screen": "quiz_details",
                "quiz_id": str(quiz_id)
            }
            
            send_topic_push(
                topic="new_quizzes", 
                title=push_title, 
                body=push_body, 
                data=push_data
            )
            logs.append("Push Notification enviado ao Firebase.")
        except Exception as e:
            logs.append(f"Erro ao enviar Push: {str(e)}")
        
        return {
            "status": "Processado",
            "logs": logs
        }