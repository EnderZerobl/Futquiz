from pydantic import BaseModel, Field
from typing import List, Optional
from dataclasses import dataclass # Importação necessária para a Entidade

@dataclass
class Pergunta:
    id: int
    texto: str
    opcoes: List[str]
    indice_opcao_correta: int
    tempo_quiz_segundos: int