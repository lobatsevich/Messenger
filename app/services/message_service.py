from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.repositories import MessageRepository
from app.services.chat_service import ChatService


class MessageService:
    
    def __init__(self, db: Session):
        self.db = db
        self.chat_service = ChatService(db)
        self.message_repo = MessageRepository(db)

    
    def send_message(self, chat_id: int, sender_id: int, content: str):
        self.chat_service.check_membership(
            chat_id, 
            sender_id
        )

        message = self.message_repo.create_message(
            chat_id,
            sender_id,
            content
        )

        self.chat_service.update_last_message(
            chat_id,
            message.id,
            message.created_at
        )

        self.db.commit()
        self.db.refresh(message)

        return message
    

    def send_private_message(self, sender_id: int, receiver_id: int, content: str):
        if sender_id == receiver_id:
            raise HTTPException(400, "Cannot send message to yourself")
    
        content = content.strip() if content else ""
        if not content:
            raise HTTPException(400, "Empty message")

        chat = self.chat_service.get_or_create_private_chat(
            sender_id,
            receiver_id
        )

        message = self.send_message(
            chat.id,
            sender_id,
            content
        )

        return message

    
    def get_history(self, chat_id: int, user_id: int):
        self.chat_service.check_membership(chat_id, user_id)

        return self.message_repo.get_chat_messages(chat_id)
    

    def mark_as_read(self, chat_id: int, user_id: int):
        self.chat_service.check_membership(chat_id, user_id)

        return self.message_repo.mark_as_read(chat_id, user_id)