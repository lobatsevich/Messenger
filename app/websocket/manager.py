from fastapi import WebSocket
from collections import defaultdict


class ConnectionManager:

    def __init__(self):
        self.connections = defaultdict(set)


    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()

        self.connections[user_id].add(websocket)


    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.connections:
            self.connections[user_id].discard(websocket)
    
            if not self.connections[user_id]:
                del self.connections[user_id]

    
    async def send_to_user(self, user_id: int, data: dict):
        connections = list(self.connections.get(user_id, []))

        for websocket in connections:
            try:
                await websocket.send_json(data)
            except Exception:
                self.disconnect(user_id, websocket)


manager = ConnectionManager()