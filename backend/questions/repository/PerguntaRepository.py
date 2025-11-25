from typing import List
from shared.database import PerguntaTable
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.schemas.Pergunta import Pergunta
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from sqlalchemy.orm import Session
import json


#perguntas_db: List[Pergunta] = []
#next_id = 1

class PerguntaRepository(IPerguntaRepository):

    def __init__(self, db: Session):
        self.db = db

    def salvar_pergunta(self, pergunta_input: PerguntaInputModel) -> PerguntaViewModel:

        nova_pergunta_db = PerguntaTable(
            texto = pergunta_input.texto,
            opcoes_json = json.dumps(pergunta_input.opcoes),
            indice_opcao_correta = pergunta_input.indice_opcao_correta,
            tempo_quiz_segundos = pergunta_input.tempo_quiz_segundos
        )
        
        self.db.add(nova_pergunta_db)
        self.db.commit()
        self.db.refresh(nova_pergunta_db)

        return PerguntaViewModel(
            id = nova_pergunta_db.id,
            texto = nova_pergunta_db.texto,
            opcoes = json.loads(nova_pergunta_db.opcoes_json),
            tempo_quiz_segundos = nova_pergunta_db.tempo_quiz_segundos
        )

    def listar_perguntas(self) -> List[PerguntaViewModel]:

        perguntas_db_list = self.db.query(PerguntaTable).all()
        view_models = []
        for item in perguntas_db_list:
            view_models.append(PerguntaViewModel(
                id = item.id,
                texto = item.texto,
                opcoes = json.loads(item.opcoes_json),
                tempo_quiz_segundos = item.tempo_quiz_segundos
            ))

        return view_models
