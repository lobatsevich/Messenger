from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database.dependencies import get_db
from app.utils.jwt import SECRET_KEY, ALGORITHM
from app.database.models import User
from app.services import ChatService, MessageService, UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


def get_chat_service(db: Session = Depends(get_db)):
    return ChatService(db)


def get_message_service(db: Session = Depends(get_db)):
    return MessageService(db)


def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)