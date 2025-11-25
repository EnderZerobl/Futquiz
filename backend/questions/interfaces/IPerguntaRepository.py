from abc import ABC, abstractmethod
from typing import List
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel

class IPerguntaRepository(ABC):
    
    @abstractmethod
    def salvar_pergunta(self, pergunta: PerguntaInputModel) -> PerguntaViewModel:
        raise NotImplementedError
        
    @abstractmethod
    def listar_perguntas(self) -> List[PerguntaViewModel]:
        raise NotImplementedError