from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    sender = Column(String(50))
    receiver = Column(String(50))
    content = Column(Text)
    timestamp = Column(DateTime, default=func.now())