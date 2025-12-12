from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from quiz.schemas.quiz_schema import QuizInputModel, QuizViewModel
from quiz.service.QuizService import QuizService
from auth.dependencies import get_current_admin, get_current_user 

router = APIRouter()

@router.post("/create", response_model=QuizViewModel, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_data: QuizInputModel,
    quiz_service: QuizService = Depends(),
    admin_user: dict = Depends(get_current_admin)
):
    try:
        return quiz_service.create_quiz(quiz_data)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar quiz.")

@router.get("/list", response_model=List[QuizViewModel])
def list_quizzes(quiz_service: QuizService = Depends()):
    return quiz_service.list_available_quizzes()

@router.post("/start/{quiz_id}", status_code=status.HTTP_200_OK)
def start_quiz(quiz_id: int, quiz_service: QuizService = Depends(), user: dict = Depends(get_current_user)):
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
    quiz_service: QuizService = Depends(),
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
    quiz_service: QuizService = Depends(),
    user: dict = Depends(get_current_user)
):
    try:
        user_id = user.get("id")
        return quiz_service.leave_quiz_session(quiz_id, user_id)
    except Exception:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao processar saída do quiz.")