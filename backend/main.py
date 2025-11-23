from fastapi import FastAPI, Depends
from router.PerguntaRouter import router as pergunta_router
from repository.IPerguntaRepository import IPerguntaRepository # Abstração 1
from repository.PerguntaRepository import PerguntaRepository # Implementação 1
from service.IPerguntaService import IPerguntaService # Abstração 2
from service.PerguntaService import PerguntaService # Implementação 2
# ----------------------------------------------------
# 1. Configuração de Dependências
# ----------------------------------------------------

# Função Factory para Repositório
def get_repository() -> IPerguntaRepository:
    return PerguntaRepository()

# Função Factory para Serviço
def get_service(
    repository: IPerguntaRepository = Depends(get_repository)
) -> IPerguntaService:
    return PerguntaService(repository = repository)

# ----------------------------------------------------
# 2. Configuração da Aplicação FastAPI
# ----------------------------------------------------

app = FastAPI(
    title="Perguntas Service Test API",
    version="1.0.0",
)

# O segredo do DIP no FastAPI:
# Mapeamos a interface (chave) para a função factory (valor) que a resolve.
# Sempre que IPerguntaService for solicitado (como no router), o FastAPI
# chamará get_service para fornecer a implementação PerguntaService.
app.dependency_overrides[IPerguntaService] = get_service

# ----------------------------------------------------
# 3. Inclusão dos Routers
# ----------------------------------------------------

app.include_router(pergunta_router)