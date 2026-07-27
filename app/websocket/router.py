from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager
from app.websocket.auth import get_current_user_ws

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    user = get_current_user_ws(websocket)
    
    await manager.connect(user.id, websocket)

    try:
        while True:
            data = await websocket.receive_json()

            print(
                f"User {user.id}: {data}"
            )

    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)