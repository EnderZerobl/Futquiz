from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from shared.database import get_db, create_db_and_tables, engine 

# --- Imports de Perguntas ---
from questions.router.PerguntaRouter import router as pergunta_router
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.repository.PerguntaRepository import PerguntaRepository
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.service.PerguntaService import PerguntaService

# --- Imports de Auth e Users ---
from auth.router.AuthRouter import router as auth_router
from auth.router.UserRouter import router as user_router

from auth.interfaces.IAuthService import IAuthService
from auth.service.AuthService import AuthService

# Imports do Repositório de Auth (NOVO)
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.repository.AuthRepository import AuthRepository

# Imports do Repositório de User
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

# --- Factories (Injeção de Dependência) ---

# 1. User Dependencies (Para CRUD de Usuários)
def get_user_repository(db: Session = Depends(get_db)) -> IUserRepository:
    return UserRepository(session=db)

def get_user_service(
    repository: IUserRepository = Depends(get_user_repository)
) -> IUserService:
    return UserService(repository=repository)

# 2. Auth Dependencies (ATUALIZADO PARA LOGOUT)
# Agora precisamos do AuthRepository que lida com a Blocklist
def get_auth_repository(db: Session = Depends(get_db)) -> IAuthRepository:
    return AuthRepository(session=db)

def get_auth_service(
    repository: IAuthRepository = Depends(get_auth_repository)
) -> IAuthService:
    return AuthService(repository=repository)

# 3. Questions Dependencies
def get_pergunta_repository(db: Session = Depends(get_db)) -> IPerguntaRepository:
    return PerguntaRepository(db=db)

def get_pergunta_service(
    repository: IPerguntaRepository = Depends(get_pergunta_repository)
) -> IPerguntaService:
    return PerguntaService(repository=repository)

# 4. Admin Dependencies
def get_admin_repository(db: Session = Depends(get_db)) -> IAdminRepository:
    return AdminRepository(db)

def get_admin_service(
    repo: IAdminRepository = Depends(get_admin_repository)
) -> IAdminService:
    return AdminService(repository=repo)


# --- Inicialização do Banco ---
# Isso vai criar a tabela 'token_blocklist' automaticamente
create_db_and_tables(engine)

app = FastAPI(
    title="Soccer Quiz API (MVP)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Overrides
app.dependency_overrides[IAuthRepository] = get_auth_repository
app.dependency_overrides[IAuthService] = get_auth_service

# User Overrides
app.dependency_overrides[IUserRepository] = get_user_repository
app.dependency_overrides[IUserService] = get_user_service

# Perguntas Overrides
app.dependency_overrides[IPerguntaRepository] = get_pergunta_repository
app.dependency_overrides[IPerguntaService] = get_pergunta_service

# Admin Overrides
app.dependency_overrides[IAdminRepository] = get_admin_repository
app.dependency_overrides[IAdminService] = get_admin_service


# --- ROTAS ---
app.include_router(auth_router)
app.include_router(user_router) 
app.include_router(pergunta_router)
app.include_router(admin_router)