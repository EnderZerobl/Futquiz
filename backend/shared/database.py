from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base, Session

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

def create_db_and_tables(engine):
    Base.metadata.create_all(bind=engine) 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()