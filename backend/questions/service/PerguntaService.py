from typing import List
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel

class PerguntaService(IPerguntaService):
    
    def __init__(self, repository: IPerguntaRepository):
        self.repository = repository

    async def validar_dados_pergunta(self, dados_pergunta: PerguntaInputModel):
        
        if dados_pergunta.indice_opcao_correta < 0 or \
           dados_pergunta.indice_opcao_correta >= len(dados_pergunta.opcoes):
            raise ValueError("O índice da resposta correta é inválido ou está fora do intervalo das opções.")
            
        if len(dados_pergunta.opcoes) < 2:
            raise ValueError("Uma pergunta deve ter no mínimo duas opções de resposta.")
            
        #Poderia haver mais validações aqui (ex: profanidade, tamanho do texto, etc.)

    async def criar_pergunta(self, dados_pergunta: PerguntaInputModel) -> PerguntaViewModel:

        await self.validar_dados_pergunta(dados_pergunta)

        return await self.repository.salvar_pergunta(dados_pergunta)

    async def listar_perguntas(self) -> List[PerguntaViewModel]:
        perguntas = await self.repository.listar_perguntas()

        # Talvez aplicar lógica de negócio na listagem (Ex: ordenar, filtrar por status ativo, etc.)
        return perguntas