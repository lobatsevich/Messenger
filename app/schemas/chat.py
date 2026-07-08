from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ChatPreview(BaseModel):
    chat_id: int
    is_group: bool
    last_message: str | None
    last_message_time: datetime | None


class PrivateChatRequest(BaseModel):
    receiver_id: int


class ChatResponse(BaseModel):
    id: int
    is_group: bool

    model_config = ConfigDict(from_attributes=True)


class SendMessageRequest(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    content: str
    created_at: datetime
    edited: bool
    is_read: bool

    model_config = ConfigDict(from_attributes=True)