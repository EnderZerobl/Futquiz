from fastapi import FastAPI, Depends
from questions.router.PerguntaRouter import router as pergunta_router
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.repository.PerguntaRepository import PerguntaRepository
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.service.PerguntaService import PerguntaService
from auth.router.AuthRouter import router as auth_router
from auth.interfaces.IAuthRepository import IAuthRepository as IAuthRepo
from auth.repository.AuthRepository import AuthRepository
from auth.interfaces.IAuthService import IAuthService as IAuthServ
from auth.service.AuthService import AuthService
from shared.database import get_db
from sqlalchemy.orm import Session
from shared.database import create_db_and_tables, engine

def get_pergunta_repository() -> IPerguntaRepository:
    return PerguntaRepository()

def get_pergunta_service(
    repository: IPerguntaRepository = Depends(get_pergunta_repository)
) -> IPerguntaService:
    return PerguntaService(repository = repository)

def get_auth_repository(db_session: Session = Depends(get_db)) -> IAuthRepo:
    return AuthRepository(session=db_session)

def get_auth_service(
    repository: IAuthRepo = Depends(get_auth_repository)
) -> IAuthServ:
    return AuthService(repository = repository)

def setup_database():
    create_db_and_tables(engine)

app = FastAPI(
    title="Soccer Quiz API (30% MVP)",
    version="1.0.0",
)
app.dependency_overrides[IPerguntaService] = get_pergunta_service
app.dependency_overrides[IAuthServ] = get_auth_service
app.add_event_handler("startup", setup_database)
app.include_router(pergunta_router)
app.include_router(auth_router)