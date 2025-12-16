from pydantic import BaseModel, Field
from typing import List, Optional

class QuizInputModel(BaseModel):
    nome_quiz: str = Field(..., max_length=100)
    tema: str = Field(..., max_length=50)
    tempo_por_questao_segundos: int = Field(..., ge=10, le=60)
    pergunta_ids: List[int] = Field(..., min_length=1)
    valor_recompensa: Optional[float] = Field(None, ge=0.0)

class QuizViewModel(BaseModel):
    id: int
    nome_quiz: str
    tema: str
    tempo_por_questao_segundos: int
    total_perguntas: int
    valor_recompensa: Optional[float] = None

    class Config:
        from_attributes = True