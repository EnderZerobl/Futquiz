from typing import List, Optional
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from questions.schemas.question_metrics_schema import PerguntaDashboardViewModel, QuestionMetric 
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
    
    def buscar_perguntas_por_tags(self, tags: Optional[List[str]]) -> List[PerguntaViewModel]:
        if not tags:
             return self.repository.listar_perguntas()
        return self.repository.list_perguntas_by_tags(tags)
    
    def get_dashboard_metrics(self) -> PerguntaDashboardViewModel:
        """Processa os dados agregados para o Dashboard (REQ 12)."""
        
        raw_metrics = self.repository.get_dashboard_metrics()
        
        processed_metrics = []
        for row in raw_metrics:
            total = row.total_respostas
            corretas = row.total_corretas
            
            taxa_acerto = (corretas / total) * 100 if total > 0 else 0.0
            
            processed_metrics.append(QuestionMetric(
                pergunta_id=row.pergunta_id,
                texto=row.texto,
                total_respostas=total,
                total_corretas=corretas,
                taxa_acerto=round(taxa_acerto, 2),
                tempo_medio_resposta_ms=int(row.tempo_medio_resposta_ms) if row.tempo_medio_resposta_ms is not None else None
            ))
            
        return PerguntaDashboardViewModel(metrics=processed_metrics)