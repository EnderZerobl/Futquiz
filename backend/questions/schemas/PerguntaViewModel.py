from pydantic import BaseModel, Field
from typing import List, Optional

# --- 2. DTO de Saída (View Model) ---
class PerguntaViewModel(BaseModel):
    id: int = Field(..., description = "ID único da pergunta no sistema.")
    texto: str
    opcoes: List[str]
    tempo_quiz_segundos: int
    
    