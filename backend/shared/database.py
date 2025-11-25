from sqlalchemy import create_engine
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

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
    
    password_hash = Column(String, nullable=False)

    name = Column(String)



class PerguntaTable(Base):
    __tablename__ = "perguntas"
    
    id = Column(Integer, primary_key=True, index=True)
    texto = Column(String, nullable=False)
    
    # Armazenar a lista de opções como JSON/String.
    # Em um DB mais robusto, você usaria uma tabela separada (relacionamento one-to-many).
    # Para SQLite e simplicidade, usaremos String (o SQLAlchemy pode serializar JSON).
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