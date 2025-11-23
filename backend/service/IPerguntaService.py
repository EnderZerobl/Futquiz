from abc import ABC, abstractmethod
from typing import List
from models.DTOs.Inputs.PerguntaInputModel import PerguntaInputModel 
from models.DTOs.Views.PerguntaViewModel import PerguntaViewModel

class IPerguntaService(ABC):

    @abstractmethod
    async def criar_pergunta(self, dados_pergunta: PerguntaInputModel) -> PerguntaViewModel:
        raise NotImplementedError
        
    @abstractmethod
    async def listar_perguntas(self) -> List[PerguntaViewModel]:
        raise NotImplementedError