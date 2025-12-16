from abc import ABC, abstractmethod
from typing import List, Optional
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel

class IQuizRepository(ABC):
    
    @abstractmethod
    def create_quiz(self, quiz_data: QuizInputModel) -> QuizViewModel:
        pass
    
    @abstractmethod
    def list_available_quizzes(self) -> List[QuizViewModel]:
        pass

    @abstractmethod
    def get_quiz_details(self, quiz_id: int) -> Optional[QuizViewModel]:
        pass
        
    @abstractmethod
    def end_quiz_session(self, quiz_id: int) -> bool:
        pass