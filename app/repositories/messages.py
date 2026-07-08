from app.database.models import Message
from sqlalchemy.orm import Session


class MessageRepository:
    
    def __init__(self, db: Session):
        self.db = db

    
    def create_message(self, chat_id: int, sender_id: int, content: str):
        msg = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            content=content
        )

        self.db.add(msg)
        self.db.flush()
        
        return msg
    

    def get_chat_messages(self, chat_id: int):
        return (
            self.db.query(Message)
            .filter(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
            .all()
        )
    

    def mark_as_read(self, chat_id: int, current_user_id: int):
        updated = self.db.query(Message).filter(
            Message.chat_id == chat_id,
            Message.sender_id != current_user_id,
            Message.is_read == False
        ).update({Message.is_read: True})

        self.db.commit()

        return updated
    
    
    def get_last_message(self, chat_id: int):
        return (
            self.db.query(Message)
            .filter(Message.chat_id == chat_id)
            .order_by(Message.created_at.desc())
            .first()
        )
    

    def get_by_id(self, message_id: int):
        return (
            self.db.query(Message)
            .filter(Message.id == message_id)
            .first()
        )
    