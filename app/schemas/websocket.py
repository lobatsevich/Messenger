from typing import Literal
from pydantic import BaseModel
from app.schemas.chat import MessageResponse


class WebSocketEvent(BaseModel):
    type: str


class NewMessageEvent(WebSocketEvent):
    type: Literal["new_message"]
    message: MessageResponse


class TypingEvent(WebSocketEvent):
    type: Literal["typing"] = "typing"
    user_id: int
    chat_id: int