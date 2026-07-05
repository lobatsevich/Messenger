from sqlalchemy import Column, Integer, Boolean, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)

    is_group = Column(
        Boolean,
        default=False,
        nullable=False
    )
    
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    last_message_id = Column(Integer, nullable=True)
    last_message_at = Column(DateTime(timezone=True), nullable=True)