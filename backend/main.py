import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shared.database import create_db_and_tables, engine 
from auth.router.AuthRouter import router as auth_router
from auth.router.UserRouter import router as user_router
from questions.router.PerguntaRouter import router as pergunta_router
from admin.router.admin_router import router as admin_router
from teams.router import team_router
from quiz.router import quiz_router

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

app.include_router(auth_router)
app.include_router(user_router) 
app.include_router(pergunta_router)
app.include_router(admin_router)

# --- CORREÇÃO AQUI ---
# Removido o prefix="/teams" e prefix="/quiz" daqui, pois eles já devem estar definidos dentro dos routers.
# Se team_router não tiver prefixo interno, avise e colocamos de volta.
# Mas para o Quiz, sabemos que o arquivo quiz_router.py JÁ TEM prefix="/quiz".

app.include_router(team_router.router) 
app.include_router(quiz_router.router)