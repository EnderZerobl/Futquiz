from typing import List
from questions.repository.IPerguntaRepository import IPerguntaRepository
from questions.schemas.Pergunta import Pergunta
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
import uuid # Usaremos para simular IDs sequenciais

# Simulação de um 'Banco de Dados' em memória
# depois, troca pra um banco real (SQLLite, SQL, NoSQL, etc),
# ver se usa docker, etc.
perguntas_db: List[Pergunta] = []
next_id = 1

class PerguntaRepository(IPerguntaRepository):
    async def salvar_pergunta(self, pergunta_input: PerguntaInputModel) -> PerguntaViewModel:
        global next_id

        nova_pergunta = Pergunta(
            id = next_id,
            texto = pergunta_input.texto,
            opcoes = pergunta_input.opcoes,
            indice_opcao_correta = pergunta_input.indice_opcao_correta,
            tempo_quiz_segundos = pergunta_input.tempo_quiz_segundos
        )
        next_id += 1 

        perguntas_db.append(nova_pergunta)

        return PerguntaViewModel(
            id = nova_pergunta.id,
            texto = nova_pergunta.texto,
            opcoes = nova_pergunta.opcoes,
            tempo_quiz_segundos = nova_pergunta.tempo_quiz_segundos
        )

    async def listar_perguntas(self) -> List[PerguntaViewModel]:
        view_models = []
        for item in perguntas_db:
            view_models.append(PerguntaViewModel(
                id = item.id,
                texto = item.texto,
                opcoes = item.opcoes,
                tempo_quiz_segundos = item.tempo_quiz_segundos
            ))

        return view_models
