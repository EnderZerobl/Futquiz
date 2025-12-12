from quiz.interfaces.IQuizRepository import IQuizRepository
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from teams.service.TeamService import TeamService 
from fastapi import Depends, HTTPException, status
from typing import List

class QuizService:
    def __init__(self, 
                 repository: IQuizRepository = Depends(),
                 team_service: TeamService = Depends()): 
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