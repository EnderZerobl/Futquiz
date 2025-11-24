from sqlalchemy import create_engine, Column, Integer, String, Date
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
    
    password_hash = Column(String, nullable=False)

def create_db_and_tables(engine):
    Base.metadata.create_all(bind=engine) 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()