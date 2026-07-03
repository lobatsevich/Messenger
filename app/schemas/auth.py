from pydantic import BaseModel


class RegisterRequest(BaseModel):
    login: str
    username: str
    password: str
    tag: str
