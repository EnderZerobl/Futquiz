from pydantic import BaseModel
from typing import List, Optional

class QuizResultViewModel(BaseModel):
    user_id: int
    username: Optional[str] = None
    total_score: int
    total_time_ms: int
    correct_answers: int

class GlobalRankingViewModel(BaseModel):
    user_id: int
    username: Optional[str] = None
    total_score_general: int
    total_quizzes_played: int
    avg_speed_ms: int 

class QuizMetricsViewModel(BaseModel):
    quiz_id: int
    quiz_name: str
    results: List[QuizResultViewModel]
    fastest_player: Optional[QuizResultViewModel] = None