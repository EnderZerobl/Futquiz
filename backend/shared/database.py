from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, Text, Float
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import json

SQLALCHEMY_DATABASE_URL = "sqlite:///./futquiz.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserTable(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    last_name = Column(String)
    cpf = Column(String, unique=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    
    is_admin = Column(Boolean, default=False)
    password_hash = Column(String, nullable=False)

class PerguntaTable(Base):
    __tablename__ = "perguntas"
    
    id = Column(Integer, primary_key=True, index=True)
    texto = Column(String, nullable=False)
    opcoes_json = Column("opcoes", String, nullable=False)
    indice_opcao_correta = Column(Integer, nullable=False)
    tempo_quiz_segundos = Column(Integer, nullable=False)
    tags_json = Column(String, nullable=True)

class QuizResultTable(Base):
    __tablename__ = 'quiz_results'
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, nullable=False, index=True) 
    user_id = Column(Integer, nullable=False, index=True) 
    
    # Dados para Ranking e Métricas
    total_score = Column(Integer, default=0) 
    total_time_ms = Column(Integer, default=0) 
    correct_answers = Column(Integer, default=0)
    
    username = Column(String(100), nullable=True)


class TeamTable(Base):
    __tablename__ = 'teams'
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), unique=True, index=True, nullable=False)
    sigla = Column(String(10), nullable=False)
    pais_origem = Column(String(50))
    cidade_origem = Column(String(50))
    ano_fundacao = Column(Integer)
    estadio = Column(String(100))
    escudo_url = Column(String(255))

class PerguntaAnswerTable(Base):
    __tablename__ = 'pergunta_answers'
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    pergunta_id = Column(Integer, nullable=False, index=True)
    
    is_correct = Column(Boolean, nullable=False)
    response_time_ms = Column(Integer, nullable=False)

class QuizTable(Base):
    __tablename__ = 'quizzes'
    
    id = Column(Integer, primary_key=True, index=True)
    nome_quiz = Column(String(100), nullable=False)
    tema = Column(String(50))
    tempo_por_questao_segundos = Column(Integer, default=20)
    valor_recompensa = Column(Float, default=0.0)
    total_perguntas = Column(Integer)
    pergunta_ids_json = Column(Text, nullable=False) 
    status = Column(Integer, default=0)

    @property
    def pergunta_ids(self):
        if self.pergunta_ids_json:
            return json.loads(self.pergunta_ids_json)
        return []

    @pergunta_ids.setter
    def pergunta_ids(self, ids: list):
        self.pergunta_ids_json = json.dumps(ids)


def create_db_and_tables(engine):
    Base.metadata.create_all(bind=engine) 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()