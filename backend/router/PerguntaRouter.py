from fastapi import FastAPI, Depends
from typing import List, Callable
from fastapi import APIRouter, Depends, status, HTTPException
from models.DTOs.Inputs.PerguntaInputModel import PerguntaInputModel 
from models.DTOs.Views.PerguntaViewModel import PerguntaViewModel
from repository.IPerguntaRepository import IPerguntaRepository 
from service.IPerguntaService import IPerguntaService 


# ----------------------------------------------------
# 1. Definição do Roteador
# ----------------------------------------------------

router = APIRouter(
    prefix = "/perguntas",
    tags = ["Perguntas"],
)

# ----------------------------------------------------
# 2. Endpoints
# ----------------------------------------------------

# Endpoint para criar perguntas (REQ 03 - Admin)
@router.post(
    "/create",
    response_model = PerguntaViewModel,
    status_code = status.HTTP_201_CREATED,
    summary="Cria uma nova pergunta (Apenas para Admin)"
)
# O Roteador recebe a ABSTRAÇÃO do Serviço (IPerguntaService) via Depends.
async def criar_pergunta(
    dados_pergunta: PerguntaInputModel,
    # A dependência agora usa a função dummy que solicita a interface
    service: IPerguntaService = Depends() 
):
    try:
        nova_pergunta = await service.criar_pergunta(dados_pergunta)
        return nova_pergunta
    except ValueError as e:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = str(e)
        )


# Endpoint para listar perguntas (REQ 04)
@router.get(
    "/list",
    response_model = List[PerguntaViewModel],
    status_code = status.HTTP_200_OK,
    summary = "Lista todas as perguntas ativas"
)
async def listar_perguntas(
    service: IPerguntaService = Depends()
):
    perguntas = await service.listar_perguntas()
    return perguntas