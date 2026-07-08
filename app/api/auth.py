from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.jwt import create_access_token

from app.services import UserService
from app.database.models import User
from app.api.deps import get_current_user, get_user_service
from app.schemas import RegisterRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(
    request: RegisterRequest, 
    service: UserService = Depends(get_user_service)
):
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
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UserService = Depends(get_user_service)
):
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
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "login": user.login,
        "username": user.username,
        "tag": user.tag
    }