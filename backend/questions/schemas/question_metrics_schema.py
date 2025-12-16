from pydantic import BaseModel
from typing import List, Optional

class QuestionMetric(BaseModel):
    pergunta_id: int
    texto: str
    total_respostas: int
    total_corretas: int
    taxa_acerto: float 
    tempo_medio_resposta_ms: Optional[int]
    
class PerguntaDashboardViewModel(BaseModel):
    metrics: List[QuestionMetric]