from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from shared.database import get_db
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from questions.service.PerguntaService import PerguntaService
from questions.repository.PerguntaRepository import PerguntaRepository
from questions.schemas.question_metrics_schema import PerguntaDashboardViewModel 

from auth.dependencies import get_current_admin
from auth.schemas.user_schema import UserView

router = APIRouter(
    prefix = "/perguntas",
    tags = ["Perguntas"],
)

def get_pergunta_service(db: Session = Depends(get_db)):
    repo = PerguntaRepository(db)
    return PerguntaService(repo)


@router.post(
    "/create",
    response_model = PerguntaViewModel,
    status_code = status.HTTP_201_CREATED,
    summary="Cria uma nova pergunta (RESTRITO A ADMIN)"
)
def criar_pergunta(
    dados_pergunta: PerguntaInputModel,
    service: PerguntaService = Depends(get_pergunta_service),
    current_admin: UserView = Depends(get_current_admin)   
):
    try:
        nova_pergunta = service.criar_pergunta(dados_pergunta)
        return nova_pergunta
    except ValueError as e:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = str(e)
        )

@router.get(
    "/list",
    response_model = List[PerguntaViewModel],
    status_code = status.HTTP_200_OK,
    summary = "Lista todas as perguntas ativas"
)
def listar_perguntas(
    service: PerguntaService = Depends(get_pergunta_service)
):
    perguntas = service.listar_perguntas()
    return perguntas


@router.get(
    "/dashboard/metrics",
    response_model = PerguntaDashboardViewModel, 
    status_code = status.HTTP_200_OK,
    summary="Dashboard de métricas por questão (RESTRITO A ADMIN)"
)
def get_question_dashboard(
    service: PerguntaService = Depends(get_pergunta_service),
    current_admin: UserView = Depends(get_current_admin)   
):
    """Retorna estatísticas sobre a performance de cada pergunta no quiz."""
    return service.get_dashboard_metrics()