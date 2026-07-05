from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.api.deps import get_current_user
from app.database.models import User
from app.services import ChatService

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("")
def get_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ChatService(db)

    return service.get_user_chats(current_user.id)