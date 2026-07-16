from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.database.models import User
from app.services import ChatService, MessageService, UserService
from app.websocket import WebSocketNotifier
from app.utils.jwt import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_user_by_token(token: str, db: Session):
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return get_user_by_token(token, db)

def get_chat_service(db: Session = Depends(get_db)):
    return ChatService(db)


def get_message_service(db: Session = Depends(get_db)):
    return MessageService(db)


def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)


def get_websocket_notifier(db: Session = Depends(get_db)):
    return WebSocketNotifier(db)