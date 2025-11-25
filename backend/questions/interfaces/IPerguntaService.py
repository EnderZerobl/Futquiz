from abc import ABC, abstractmethod
from typing import List
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel

class IPerguntaService(ABC):

    @abstractmethod
    def criar_pergunta(self, dados_pergunta: PerguntaInputModel) -> PerguntaViewModel:
        raise NotImplementedError
        
    @abstractmethod
    def listar_perguntas(self) -> List[PerguntaViewModel]:
        raise NotImplementedError