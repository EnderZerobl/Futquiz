from typing import List
from shared.database import PerguntaTable
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from shared.database import PerguntaTable, PerguntaAnswerTable 
from sqlalchemy import func, case
from sqlalchemy.orm import Session
from sqlalchemy import or_ 
import json

class PerguntaRepository(IPerguntaRepository):

    def __init__(self, db: Session):
        self.db = db

    def salvar_pergunta(self, pergunta_input: PerguntaInputModel) -> PerguntaViewModel:

        tags_list = pergunta_input.tags if pergunta_input.tags else []
        
        nova_pergunta_db = PerguntaTable(
            texto = pergunta_input.texto,
            opcoes_json = json.dumps(pergunta_input.opcoes),
            indice_opcao_correta = pergunta_input.indice_opcao_correta,
            tempo_quiz_segundos = pergunta_input.tempo_quiz_segundos,
            tags_json = json.dumps(tags_list)
        )
        
        self.db.add(nova_pergunta_db)
        self.db.commit()
        self.db.refresh(nova_pergunta_db)

        return PerguntaViewModel(
            id = nova_pergunta_db.id,
            texto = nova_pergunta_db.texto,
            opcoes = json.loads(nova_pergunta_db.opcoes_json),
            tempo_quiz_segundos = nova_pergunta_db.tempo_quiz_segundos,
            tags = tags_list
        )

    def listar_perguntas(self) -> List[PerguntaViewModel]:

        perguntas_db_list = self.db.query(PerguntaTable).all()
        view_models = []
        for item in perguntas_db_list:
            tags_list = []
            if item.tags_json:
                tags_list = json.loads(item.tags_json)
            
            view_models.append(PerguntaViewModel(
                id = item.id,
                texto = item.texto,
                opcoes = json.loads(item.opcoes_json),
                tempo_quiz_segundos = item.tempo_quiz_segundos,
                tags = tags_list
            ))

        return view_models
    
    def list_perguntas_by_tags(self, tags: List[str]) -> List[PerguntaViewModel]:
        
        if not tags:
            return self.listar_perguntas()
            
        search_conditions = [PerguntaTable.tags_json.like(f'%"{tag}"%') for tag in tags]
        
        query = self.db.query(PerguntaTable)
        query = query.filter(or_(*search_conditions))

        perguntas_db_list = query.all()
        
        view_models = []
        for item in perguntas_db_list:
            tags_list = []
            if item.tags_json:
                tags_list = json.loads(item.tags_json)
            
            view_models.append(PerguntaViewModel(
                id = item.id,
                texto = item.texto,
                opcoes = json.loads(item.opcoes_json),
                tempo_quiz_segundos = item.tempo_quiz_segundos,
                tags = tags_list
            ))
            
        return view_models
    
    def get_dashboard_metrics(self):
        """Calcula métricas de performance por pergunta (REQ 12)."""
        
        metrics = (
            self.db.query(
                PerguntaTable.id.label("pergunta_id"),
                PerguntaTable.texto,
                func.count(PerguntaAnswerTable.id).label("total_respostas"),
                func.sum(case((PerguntaAnswerTable.is_correct == True, 1), else_=0)).label("total_corretas"),
                func.avg(PerguntaAnswerTable.response_time_ms).label("tempo_medio_resposta_ms")
            )
            .join(PerguntaAnswerTable, PerguntaTable.id == PerguntaAnswerTable.pergunta_id)
            .group_by(PerguntaTable.id, PerguntaTable.texto)
            .all()
        )
        return metrics
    
    
