from pydantic import BaseModel, Field
from typing import List, Optional

# --- 1. DTO de Entrada (Input Model) ---
class PerguntaInputModel(BaseModel):
    texto: str = Field(..., description = "O enunciado da pergunta.")
    opcoes: List[str] = Field(..., description = "As opções de resposta.")
    indice_opcao_correta: int = Field(..., description = "O índice (0-based) da opção correta.")
    tempo_quiz_segundos: int = Field(20, ge=5, description = "Tempo limite em segundos para responder a questão.")