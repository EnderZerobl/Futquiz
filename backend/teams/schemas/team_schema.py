from pydantic import BaseModel, Field
from typing import List, Optional

class TeamInputModel(BaseModel):
    nome: str = Field(..., max_length=100)
    sigla: str = Field(..., max_length=10)
    pais_origem: str = Field(..., max_length=50)
    cidade_origem: str = Field(..., max_length=50)
    ano_fundacao: int = Field(..., ge=1800)
    estadio: str = Field(..., max_length=100)
    escudo_url: Optional[str] = None

class TeamViewModel(BaseModel):
    id: int
    nome: str
    sigla: str
    pais_origem: str
    cidade_origem: str
    ano_fundacao: int
    estadio: str
    escudo_url: Optional[str] = None