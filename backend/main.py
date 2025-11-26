from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from shared.database import get_db, create_db_and_tables, engine 

# --- Imports de Perguntas ---
from questions.router.PerguntaRouter import router as pergunta_router
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.repository.PerguntaRepository import PerguntaRepository
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.service.PerguntaService import PerguntaService

# --- Imports de Auth ---
from auth.router.AuthRouter import router as auth_router
from auth.interfaces.IAuthRepository import IAuthRepository as IAuthRepo
from auth.repository.AuthRepository import AuthRepository
from auth.interfaces.IAuthService import IAuthService as IAuthServ
from auth.service.AuthService import AuthService
from auth.router.UserRouter import router as user_router 
from auth.router.UserRouter import router as user_router
from auth.interfaces.IUserRepository import IUserRepository
from auth.repository.UserRepository import UserRepository
from auth.interfaces.IUserService import IUserService
from auth.service.UserService import UserService

# --- IMPORTS DO ADMIN ---
from admin.router.admin_router import router as admin_router
from admin.interfaces.IAdminRepository import IAdminRepository
from admin.interfaces.IAdminService import IAdminService
from admin.repository.admin_repository import AdminRepository
from admin.service.admin_service import AdminService

from auth.model import User 

def get_auth_repository(db: Session = Depends(get_db)) -> IAuthRepo:
    return AuthRepository(session=db)

def get_auth_service(
    repository: IAuthRepo = Depends(get_auth_repository)
) -> IAuthServ:
    return AuthService(repository=repository)

def get_user_repository(db: Session = Depends(get_db)) -> IUserRepository:
    return UserRepository(session=db)

def get_user_service(
    repository: IUserRepository = Depends(get_user_repository)
) -> IUserService:
    return UserService(repository=repository)

def get_pergunta_repository(db: Session = Depends(get_db)) -> IPerguntaRepository:
    return PerguntaRepository(db=db)

def get_pergunta_service(
    repository: IPerguntaRepository = Depends(get_pergunta_repository)
) -> IPerguntaService:
    return PerguntaService(repository=repository)

def get_admin_repository(db: Session = Depends(get_db)) -> IAdminRepository:
    return AdminRepository(db)

def get_admin_service(
    repo: IAdminRepository = Depends(get_admin_repository)
) -> IAdminService:
    return AdminService(repository=repo)

create_db_and_tables(engine)

app = FastAPI(
    title="Soccer Quiz API (30% MVP)",
    version="1.0.0",
)

app.dependency_overrides[IAuthServ] = get_auth_service
app.dependency_overrides[IUserService] = get_user_service
app.dependency_overrides[IAuthRepo] = get_auth_repository
app.dependency_overrides[IUserRepository] = get_user_repository
app.dependency_overrides[IPerguntaService] = get_pergunta_service
app.dependency_overrides[IPerguntaRepository] = get_pergunta_repository

# Overrides do Admin
app.dependency_overrides[IAdminRepository] = get_admin_repository
app.dependency_overrides[IAdminService] = get_admin_service


# --- ROTAS ---
app.include_router(auth_router)
app.include_router(pergunta_router)
app.include_router(admin_router)