from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_chat_service, get_message_service
from app.database.models import User
from app.services import ChatService, MessageService
from app.schemas import ChatPreview, PrivateChatRequest, ChatResponse, SendMessageRequest, MessageResponse

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("", response_model=list[ChatPreview])
def get_chats(
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    return service.get_user_chats(current_user.id)


@router.post("/private", response_model=ChatResponse)
def private_chat(
    request: PrivateChatRequest,
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service)
):
    return service.get_or_create_private_chat(current_user.id, request.receiver_id)


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
def get_history(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service)
):
    return service.get_history(chat_id, current_user.id)


@router.post("/{chat_id}/messages")
def send_message(
    chat_id: int,
    request: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service)
):
    return service.send_message(
        chat_id,
        current_user.id,
        request.content    
    )


@router.patch("/{chat_id}/read")
def read_messages(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    service: MessageService = Depends(get_message_service)
):
    updated = service.mark_as_read(chat_id, current_user.id)

    return {"status": "ok", "updated_messages": updated}