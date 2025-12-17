from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from sqlalchemy.orm import Session
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from quiz.service.QuizService import QuizService
from quiz.repository.QuizRepository import QuizRepository
from teams.router.team_router import get_team_service
from teams.service.TeamService import TeamService
from shared.database import get_db
from auth.dependencies import get_current_admin, get_current_user 
from auth.model import User
from quiz.schemas.metrics_schema import GlobalRankingViewModel, QuizMetricsViewModel

router = APIRouter()

def get_quiz_service(
    db: Session = Depends(get_db),
    team_service: TeamService = Depends(get_team_service)
):
    repo = QuizRepository(db)
    return QuizService(repo, team_service)

@router.post("/create", response_model=QuizViewModel, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_data: QuizInputModel,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: User = Depends(get_current_admin)
):
    try:
        return quiz_service.create_quiz(quiz_data)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar quiz.")

@router.get("/list", response_model=List[QuizViewModel])
def list_quizzes(quiz_service: QuizService = Depends(get_quiz_service)):
    return quiz_service.list_available_quizzes()

@router.post("/start/{quiz_id}", status_code=status.HTTP_200_OK)
def start_quiz(quiz_id: int, quiz_service: QuizService = Depends(get_quiz_service), user: User = Depends(get_current_user)):
    try:
        return quiz_service.start_quiz_session(quiz_id, user.id)
        
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao iniciar sessão do quiz.")
    
@router.post("/end/{quiz_id}", status_code=status.HTTP_200_OK)
def end_quiz_session(
    quiz_id: int,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: User = Depends(get_current_admin) 
):
    try:
        return quiz_service.end_quiz_admin(quiz_id)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro interno ao encerrar quiz.")

@router.post("/leave/{quiz_id}", status_code=status.HTTP_200_OK)
def leave_quiz_session(
    quiz_id: int,
    quiz_service: QuizService = Depends(get_quiz_service),
    user: User = Depends(get_current_user)
):
    try:
        return quiz_service.leave_quiz_session(quiz_id, user.id)
    except Exception:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao processar saída do quiz.")
    
@router.get(
    "/ranking/global",
    response_model=List[GlobalRankingViewModel],
    status_code=status.HTTP_200_OK,
    summary="Obtém o ranking geral de jogadores (Top 100)."
)
def get_global_ranking_players(
    quiz_service: QuizService = Depends(get_quiz_service),
    user: User = Depends(get_current_user)
):
    return quiz_service.get_global_ranking()


@router.get(
    "/metrics/{quiz_id}",
    response_model=QuizMetricsViewModel,
    status_code=status.HTTP_200_OK,
    summary="Obtém métricas e ranking final de uma partida específica (RESTRITO A ADMIN)."
)
def get_quiz_metrics_by_id(
    quiz_id: int,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: User = Depends(get_current_admin)
):
    try:
        return quiz_service.get_quiz_metrics(quiz_id)
    except HTTPException as e:
        raise e
        
@router.post(
    "/notify/new/{quiz_id}",
    status_code=status.HTTP_200_OK,
    summary="Dispara notificação push sobre novo quiz (RESTRITO A ADMIN)."
)
def notify_new_quiz(
    quiz_id: int,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: User = Depends(get_current_admin)
):
    try:
        return quiz_service.trigger_new_quiz_notification(quiz_id)
    except HTTPException as e:
        raise e