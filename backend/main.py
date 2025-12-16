from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from shared.database import get_db, create_db_and_tables, engine 

from questions.router.PerguntaRouter import router as pergunta_router
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.repository.PerguntaRepository import PerguntaRepository
from questions.interfaces.IPerguntaService import IPerguntaService
from questions.service.PerguntaService import PerguntaService

from auth.router.AuthRouter import router as auth_router
from auth.router.UserRouter import router as user_router
from auth.interfaces.IAuthService import IAuthService
from auth.service.AuthService import AuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.repository.AuthRepository import AuthRepository
from auth.interfaces.IUserRepository import IUserRepository
from auth.repository.UserRepository import UserRepository
from auth.interfaces.IUserService import IUserService
from auth.service.UserService import UserService

from admin.router.admin_router import router as admin_router
from admin.interfaces.IAdminRepository import IAdminRepository
from admin.interfaces.IAdminService import IAdminService
from admin.repository.admin_repository import AdminRepository
from admin.service.admin_service import AdminService


from teams.router import team_router
from teams.interfaces.ITeamRepository import ITeamRepository
from teams.repository.TeamRepository import TeamRepository
from teams.service.TeamService import TeamService

from quiz.router import quiz_router
from quiz.interfaces.IQuizRepository import IQuizRepository
from quiz.repository.QuizRepository import QuizRepository
from quiz.service.QuizService import QuizService



def get_user_repository(db: Session = Depends(get_db)) -> IUserRepository:
    return UserRepository(session=db)

def get_user_service(
    repository: IUserRepository = Depends(get_user_repository)
) -> IUserService:
    return UserService(repository=repository)

def get_auth_repository(db: Session = Depends(get_db)) -> IAuthRepository:
    return AuthRepository(session=db)

def get_auth_service(
    repository: IAuthRepository = Depends(get_auth_repository)
) -> IAuthService:
    return AuthService(repository=repository)

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

def get_team_repository(db: Session = Depends(get_db)) -> ITeamRepository:
    return TeamRepository(db=db)

def get_team_service(
    repository: ITeamRepository = Depends(get_team_repository)
) -> TeamService:
    return TeamService(repository=repository)

def get_quiz_repository(db: Session = Depends(get_db)) -> IQuizRepository:
    return QuizRepository(db=db)

def get_quiz_service(
    repository: IQuizRepository = Depends(get_quiz_repository),
    team_service: TeamService = Depends(get_team_service)
) -> QuizService:
    return QuizService(repository=repository, team_service=team_service)


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

app.dependency_overrides[IAuthRepository] = get_auth_repository
app.dependency_overrides[IAuthService] = get_auth_service
app.dependency_overrides[IUserRepository] = get_user_repository
app.dependency_overrides[IUserService] = get_user_service
app.dependency_overrides[IPerguntaRepository] = get_pergunta_repository
app.dependency_overrides[IPerguntaService] = get_pergunta_service
app.dependency_overrides[IAdminRepository] = get_admin_repository
app.dependency_overrides[IAdminService] = get_admin_service
app.dependency_overrides[ITeamRepository] = get_team_repository
app.dependency_overrides[TeamService] = get_team_service
app.dependency_overrides[IQuizRepository] = get_quiz_repository
app.dependency_overrides[QuizService] = get_quiz_service
app.include_router(auth_router)
app.include_router(user_router) 
app.include_router(pergunta_router)
app.include_router(admin_router)
app.include_router(team_router.router, prefix="/teams", tags=["Times"])
app.include_router(quiz_router.router, prefix="/quiz", tags=["Quiz"])