from fastapi import WebSocket, HTTPException

from app.database.database import SessionLocal


def get_current_user_ws(websocket: WebSocket):
    from app.api.deps import get_user_by_token
    
    token = websocket.query_params.get("token")

    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    
    db = SessionLocal()

    try:
        return get_user_by_token(token, db)
    
    finally:
        db.close()