from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket import manager

router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int
):
    await manager.connect(user_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()

            print(
                f'User {user_id}: {data}'
            )

    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)