from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from questions.schemas.PerguntaInputModel import PerguntaInputModel 
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from questions.interfaces.IPerguntaService import IPerguntaService 
from auth.service.AuthService import get_current_admin
from auth.schemas.user_schema import UserView

router = APIRouter(
    prefix = "/perguntas",
    tags = ["Perguntas"],
)

@router.post(
    "/create",
    response_model = PerguntaViewModel,
    status_code = status.HTTP_201_CREATED,
    summary="Cria uma nova pergunta (RESTRITO A ADMIN)"
)
def criar_pergunta(
    dados_pergunta: PerguntaInputModel,
    service: IPerguntaService = Depends(),
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
    service: IPerguntaService = Depends()
):
    perguntas = service.listar_perguntas()
    return perguntas