from app.repositories.users import UserRepository
from app.database.models import User

from app.utils.security import hash_password, verify_password

class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    
    def register_user(self, login: str, username: str, password: str, tag: str):
        if self.repository.get_by_login(login):
            raise ValueError("Login already exists")
        
        if self.repository.get_by_tag(tag):
            raise ValueError("Tag already exists")

        user = User(
            login=login,
            username=username,
            password=hash_password(password),
            tag=tag,
            avatar=None,
            status="offline"
        )

        return self.repository.create(user)
    

    def login_user(self, login: str, password: str):
        user = self.repository.get_by_login(login)

        if not user:
            raise ValueError("User not found")
        
        if not verify_password(password, user.password):
            raise ValueError("Invalid password")
        
        return user
