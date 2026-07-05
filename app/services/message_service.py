from app.repositories import MessageRepository, ChatRepository
from sqlalchemy.orm import Session

class MessageService:
    
    def __init__(self, db: Session):
        self.db = db
        self.chat_repo = ChatRepository(db)
        self.message_repo = MessageRepository(db)

    
    def send_message(self, chat_id: int, sender_id: int, content: str):
        if not self.chat_repo.is_member(chat_id, sender_id):
            raise ValueError("User not in chat")

        message = self.message_repo.create_message(
            chat_id,
            sender_id,
            content
        )

        self.chat_repo.update_last_message(
            chat_id=chat_id,
            message_id=message.id,
            timestamp=message.created_at
        )
    
        return message
    

    def send_private_message(self, sender_id: int, receiver_id: int, content: str):
        if sender_id == receiver_id:
            raise ValueError("Cannot send message to yourself")
    
        content = content.strip() if content else ""
        if not content:
            raise ValueError("Empty message")

        chat = self.chat_repo.find_private_chat(sender_id, receiver_id)
        if not chat:
            chat = self.chat_repo.create_private_chat(sender_id, receiver_id)

        message = self.send_message(
            chat_id=chat.id,
            sender_id=sender_id,
            content=content
        )

        return message

    
    def get_history(self, chat_id: int, user_id: int):
        if not self.chat_repo.is_member(chat_id, user_id):
            raise ValueError("Access denied")

        return self.message_repo.get_chat_messages(chat_id)
    

    def mark_as_read(self, chat_id: int, user_id: int):
        if not self.chat_repo.is_member(chat_id, user_id):
            raise ValueError("Access denied")

        return self.message_repo.mark_as_read(chat_id, user_id)
