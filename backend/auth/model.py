from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from sqlalchemy.sql import func
from shared.database import Base

class User(Base):
    __tablename__ = "users"
    
    __table_args__ = {'extend_existing': True} 

    id = Column(Integer, primary_key=True)
    
    name = Column(String)
    last_name = Column(String)
    cpf = Column(String, unique=True) 
    birth_date = Column(Date)
    email = Column(String, unique=True)  
    password_hash = Column(String)
    is_admin = Column(Boolean, default=False)

class TokenBlocklist(Base):
    """
    Tabela para armazenar tokens JWT que foram invalidados (Logout).
    """
    __tablename__ = "token_blocklist"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())