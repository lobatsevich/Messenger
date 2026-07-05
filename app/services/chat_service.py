from sqlalchemy.orm import Session
from datetime import datetime

from app.repositories import ChatRepository, MessageRepository

class ChatService:

    def __init__(self, db: Session):
        self.db = db
        self.chat_repo = ChatRepository(db)
        self.message_repo = MessageRepository(db)


    def get_user_chats(self, user_id: int):
        chats = self.chat_repo.get_user_chats(user_id)

        result = []

        for chat in chats:
            last_message = self.message_repo.get_last_message(chat.id)

            result.append({
                "chat_id": chat.id,
                "is_group": chat.is_group,
                "last_message": last_message.content if last_message else None,
                "last_message_time": last_message.created_at if last_message else None
            })

        result.sort(
            key=lambda x: x["last_message_time"] or datetime.min,
            reverse=True
        )

        return result
