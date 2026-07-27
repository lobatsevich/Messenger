from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException

from app.repositories import ChatRepository, MessageRepository, UserRepository


class ChatService:

    def __init__(self, db: Session):
        self.db = db
        self.chat_repo = ChatRepository(db)
        self.message_repo = MessageRepository(db)
        self.user_repo = UserRepository(db)


    def get_user_chats(self, user_id: int):
        chats = self.chat_repo.get_user_chats(user_id)

        result = []

        for chat in chats:
            last_message = None
            
            if chat.last_message_id:
                last_message = self.message_repo.get_by_id(chat.last_message_id)

            result.append({
                "chat_id": chat.id,
                "is_group": chat.is_group,
                "last_message": last_message.content if last_message else None,
                "last_message_time": chat.last_message_at
            })

        return result


    def get_or_create_private_chat(self, current_user_id: int, receiver_id: int):
        if current_user_id == receiver_id:
            raise HTTPException(400, "Cannot create chat with yourself")
        
        receiver = self.user_repo.get_by_id(receiver_id)
        
        if not receiver:
            raise HTTPException(404, "User not found")
        
        chat = self.chat_repo.find_private_chat(
            current_user_id, 
            receiver_id
        )

        if chat:
            return chat
        
        chat = self.chat_repo.create_private_chat(
            current_user_id, 
            receiver_id
        )

        self.db.commit()
        self.db.refresh(chat)
        
        return chat
    

    def check_membership(self, chat_id: int, user_id: int):
        if not self.chat_repo.is_member(chat_id, user_id):
            raise HTTPException(403, "User not in chat")
        
    
    def update_last_message(self, chat_id: int, message_id: int, timestamp):
        self.chat_repo.update_last_message(chat_id, message_id, timestamp)