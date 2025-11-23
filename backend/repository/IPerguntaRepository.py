from abc import ABC, abstractmethod
from typing import List
from models.DTOs.Inputs.PerguntaInputModel import PerguntaInputModel 
from models.DTOs.Views.PerguntaViewModel import PerguntaViewModel

class IPerguntaRepository(ABC):
    
    @abstractmethod
    async def salvar_pergunta(self, pergunta: PerguntaInputModel) -> PerguntaViewModel:
        raise NotImplementedError
        
    @abstractmethod
    async def listar_perguntas(self) -> List[PerguntaViewModel]:
        raise NotImplementedError