from sqlalchemy.orm import Session
from app.database.models import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    
    def get_by_login(self, login: str):
        return self.db.query(User).filter(User.login == login).first()
    

    def get_by_tag(self, tag: str):
        return self.db.query(User).filter(User.tag == tag).first()
    

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user