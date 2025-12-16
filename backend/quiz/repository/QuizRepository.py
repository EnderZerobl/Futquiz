from sqlalchemy.orm import Session
from typing import List, Optional

from quiz.interfaces.IQuizRepository import IQuizRepository
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from shared.database import QuizTable 

class QuizRepository(IQuizRepository):
    def __init__(self, db: Session):
        self._db = db

    def create_quiz(self, quiz_data: QuizInputModel) -> QuizViewModel:
        
        db_quiz = QuizTable(
            nome_quiz=quiz_data.nome_quiz,
            tema=quiz_data.tema,
            tempo_por_questao_segundos=quiz_data.tempo_por_questao_segundos,
            total_perguntas=len(quiz_data.pergunta_ids),
            valor_recompensa=quiz_data.valor_recompensa
        )
        
        self._db.add(db_quiz)
        self._db.commit()
        self._db.refresh(db_quiz)
        
        return QuizViewModel.model_validate(db_quiz)

    def list_available_quizzes(self) -> List[QuizViewModel]:
        db_quizzes = self._db.query(QuizTable).all()
        return [QuizViewModel.model_validate(q) for q in db_quizzes]

    def get_quiz_details(self, quiz_id: int) -> Optional[QuizViewModel]:
        db_quiz = self._db.query(QuizTable).filter(QuizTable.id == quiz_id).first()
        if db_quiz:
            return QuizViewModel.model_validate(db_quiz)
        return None
    
    def end_quiz_session(self, quiz_id: int) -> bool:
        """Marca o quiz como encerrado e salva o ranking final."""
        db_quiz = self._db.query(QuizTable).filter(QuizTable.id == quiz_id).first()
        
        if db_quiz:
            db_quiz.status = 2 
            
            self._db.commit()
            return True
        return False