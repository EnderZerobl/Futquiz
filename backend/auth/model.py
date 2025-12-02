from sqlalchemy import Column, Integer, String, Boolean, Date # <--- Importe Date
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