from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

# --- 2. DTO de Saída (View Model) ---
class PerguntaViewModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int = Field(..., description = "ID único da pergunta no sistema.")
    texto: str
    opcoes: List[str]
    tempo_quiz_segundos: int
    tags: Optional[List[str]] = None
    
    