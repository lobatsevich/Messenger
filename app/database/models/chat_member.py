from sqlalchemy import Column, Integer, ForeignKey

from app.database.database import Base


class ChatMember(Base):
    __tablename__ = "chat_members"

    id = Column(Integer, primary_key=True)

    chat_id = Column(
        Integer, 
        ForeignKey("chats.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    user_id = Column(
        Integer, 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )