from pydantic import BaseModel


class SendPrivateMessageRequest(BaseModel):
    receiver_id: int
    content: str


class SendChatMessageRequest(BaseModel):
    chat_id: int
    content: str