from typing import List
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from fastapi import HTTPException, status

class PerguntaService(IPerguntaService):
    
    def __init__(self, repository: IPerguntaRepository):
        self.repository = repository

    def validar_dados_pergunta(self, dados_pergunta: PerguntaInputModel):
        
        if dados_pergunta.indice_opcao_correta < 0 or \
           dados_pergunta.indice_opcao_correta >= len(dados_pergunta.opcoes):
            raise ValueError("O índice da resposta correta é inválido ou está fora do intervalo das opções.")
            
        if len(dados_pergunta.opcoes) < 2:
            raise ValueError("Uma pergunta deve ter no mínimo duas opções de resposta.")

    def criar_pergunta(self, dados_pergunta: PerguntaInputModel) -> PerguntaViewModel:
        
        self.validar_dados_pergunta(dados_pergunta)

        return self.repository.salvar_pergunta(dados_pergunta)

    def listar_perguntas(self) -> List[PerguntaViewModel]:
        perguntas = self.repository.listar_perguntas()
        return perguntas