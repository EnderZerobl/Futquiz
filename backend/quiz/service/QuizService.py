from quiz.interfaces.IQuizRepository import IQuizRepository
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from teams.service.TeamService import TeamService 
from shared.database import QuizResultTable, UserTable 
from quiz.schemas.metrics_schema import QuizMetricsViewModel, GlobalRankingViewModel
from sqlalchemy import func, desc
from fastapi import HTTPException, status
from typing import List

class QuizService:
    def __init__(self, 
                 repository: IQuizRepository,
                 team_service: TeamService): 
        self._repository = repository
        self._team_service = team_service

    def create_quiz(self, quiz_data: QuizInputModel) -> QuizViewModel:
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
            
        return self._repository.create_quiz(quiz_data)

    def list_available_quizzes(self) -> List[QuizViewModel]:
        return self._repository.list_available_quizzes()
    
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

    def trigger_new_quiz_notification(self, quiz_id: int) -> dict:
        quiz_details = self._repository.get_quiz_details(quiz_id)
        if not quiz_details:
             raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Quiz não encontrado para notificação.")
        
        return {
            "status": "Notification Dispatched",
            "message": f"Notificação para o quiz '{quiz_details.nome_quiz}' (ID: {quiz_id}) disparada com sucesso."
        }