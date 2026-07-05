from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories import UserRepository
from app.services import UserService

from app.utils.jwt import create_access_token

from app.api.deps import get_current_user

from app.schemas import RegisterRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    service = UserService(UserRepository(db))

    try:
        user = service.register_user(
            login=request.login, 
            username=request.username, 
            password=request.password, 
            tag=request.tag
        )
        return {"status": "ok", "user_id": user.id}

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    service = UserService(UserRepository(db))

    try:
        user = service.login_user(form_data.username, form_data.password)

        token = create_access_token({
            "user_id": user.id,
            "login": user.login
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    except ValueError as error:
        raise HTTPException(status_code=401, detail=str(error))
    

@router.get("/me")
def get_me(user = Depends(get_current_user)):
    return {
        "id": user.id,
        "login": user.login,
        "username": user.username,
        "tag": user.tag
    }