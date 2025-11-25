from sqlalchemy import Column, Integer, String, Boolean
from shared.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True) # <--- Sem index=True
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_admin = Column(Boolean, default=False)