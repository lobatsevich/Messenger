from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.database.models import Chat, ChatMember, Message


class ChatRepository:
    
    def __init__(self, db: Session):
        self.db = db
        

    def find_private_chat(self, user1_id: int, user2_id: int):
        subquery = (
            self.db.query(ChatMember.chat_id)
            .filter(ChatMember.user_id.in_([user1_id, user2_id]))
            .group_by(ChatMember.chat_id)
            .having(func.count(ChatMember.user_id) == 2)
            .subquery()
        )
        
        return (
            self.db.query(Chat)
            .filter(Chat.id.in_(subquery))
            .filter(Chat.is_group == False)
            .first()
        )
    
    
    def create_private_chat(self, user1_id: int, user2_id: int):
        chat = Chat(is_group=False)

        self.db.add(chat)
        self.db.flush()

        self.db.add_all([
            ChatMember(chat_id=chat.id, user_id=user1_id),
            ChatMember(chat_id=chat.id, user_id=user2_id)
        ])

        self.db.commit()
        self.db.refresh(chat)

        return chat
    

    def is_member(self, chat_id: int, user_id: int) -> bool:
        return (
            self.db.query(ChatMember)
            .filter(
                ChatMember.chat_id == chat_id,
                ChatMember.user_id == user_id
            )
            .first()
        ) is not None


    def get_user_chats(self, user_id: int):
        return (
            self.db.query(Chat)
            .join(ChatMember)
            .filter(ChatMember.user_id == user_id)
            .order_by(Chat.last_message_at.desc().nullslast())
            .all()
        )
    

    def update_last_message(self, chat_id: int, message_id: int, timestamp):
        self.db.query(Chat).filter(Chat.id == chat_id).update({
            Chat.last_message_id: message_id,
            Chat.last_message_at: timestamp
        })
        
        self.db.commit()