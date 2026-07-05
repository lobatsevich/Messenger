from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.api.deps import get_current_user
from app.database.models import User
from app.services import MessageService
from app.schemas import SendPrivateMessageRequest, SendChatMessageRequest

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/private")
def send_private(
    request: SendPrivateMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = MessageService(db)

    try:
        return service.send_private_message(
            sender_id=current_user.id,
            receiver_id=request.receiver_id,
            content=request.content
        )
    
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/chat")
def send_chat(
    request: SendChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = MessageService(db)

    try:
        return service.send_message(
            sender_id=current_user.id,
            chat_id=request.chat_id,
            content=request.content
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    

@router.get("/history/{chat_id}")
def get_history(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = MessageService(db)

    return service.get_history(chat_id, current_user.id)



@router.patch("/{chat_id}/read")
def read_message(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = MessageService(db)

    updated = service.mark_as_read(chat_id, current_user.id)

    return {"status": "ok", "updated_messages": updated}