from fastapi import APIRouter, Depends, status, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
from sqlalchemy.orm import Session
from shared.database import get_db
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from quiz.service.QuizService import QuizService
from quiz.repository.QuizRepository import QuizRepository
from teams.repository.TeamRepository import TeamRepository
from teams.service.TeamService import TeamService
from auth.dependencies import get_current_admin, get_current_user 
from quiz.schemas.metrics_schema import GlobalRankingViewModel, QuizMetricsViewModel

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

socket_manager = ConnectionManager()


def get_quiz_service(db: Session = Depends(get_db)):
    quiz_repo = QuizRepository(db)
    team_repo = TeamRepository(db)
    team_service = TeamService(repository=team_repo)
    
    return QuizService(
        repository=quiz_repo, 
        team_service=team_service,
        socket_manager=socket_manager 
    )

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    """
    Endpoint para clientes (Frontend/Mobile) escutarem notificações de novos quizzes.
    """
    await socket_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        socket_manager.disconnect(websocket)


@router.post("/create", response_model=QuizViewModel, status_code=status.HTTP_201_CREATED)
async def create_quiz(
    quiz_data: QuizInputModel,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: dict = Depends(get_current_admin)
):
    try:
        # Adicionado o AWAIT aqui, pois o service agora é async
        return await quiz_service.create_quiz(quiz_data) 
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Erro: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar quiz.")


@router.get("/list", response_model=List[QuizViewModel])
def list_quizzes(quiz_service: QuizService = Depends(get_quiz_service)):
    return quiz_service.list_available_quizzes()

@router.post("/start/{quiz_id}", status_code=status.HTTP_200_OK)
def start_quiz(quiz_id: int, quiz_service: QuizService = Depends(get_quiz_service), user: dict = Depends(get_current_user)):
    user_id = user.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="ID de usuário ausente no token."
        )
    try:
        return quiz_service.start_quiz_session(quiz_id, user_id)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao iniciar sessão do quiz.")
    
@router.post("/end/{quiz_id}", status_code=status.HTTP_200_OK)
def end_quiz_session(
    quiz_id: int,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: dict = Depends(get_current_admin) 
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
    user: dict = Depends(get_current_user)
):
    try:
        user_id = user.get("id")
        return quiz_service.leave_quiz_session(quiz_id, user_id)
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
    user: dict = Depends(get_current_user)
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
    admin_user: dict = Depends(get_current_admin)
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
async def notify_new_quiz(
    quiz_id: int,
    quiz_service: QuizService = Depends(get_quiz_service),
    admin_user: dict = Depends(get_current_admin)
):
    try:
        return await quiz_service.trigger_new_quiz_notification(quiz_id)
    except HTTPException as e:
        raise e