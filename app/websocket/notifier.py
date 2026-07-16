from sqlalchemy.orm import Session

from app.repositories import ChatRepository
from app.websocket.manager import manager
from app.database.models import Message
from app.schemas import MessageResponse, NewMessageEvent

class WebSocketNotifier:

    def __init__(self, db: Session):
        self.chat_repo = ChatRepository(db)

    
    async def notify_new_message(self, message: Message):
        members = self.chat_repo.get_chat_members(message.chat_id)

        event = NewMessageEvent(
            type="new_message",
            message=MessageResponse.model_validate(message)
        )

        payload = event.model_dump(mode="json")

        for member in members:
            await manager.send_to_user(
                member.user_id,
                payload
            )