from sqlalchemy import Column, Integer, String
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    
    login = Column(
        String(50), 
        unique=True, 
        nullable=False, 
        index=True
    )

    username = Column(String(50), nullable=False)
    password = Column(String(255), nullable=False)
    
    tag = Column(
        String(50),
        unique=True,
        nullable=False
    )

    avatar = Column(String(255), nullable=True)
    status = Column(String(50), default="offline")