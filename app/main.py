from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.pages import router as pages_router
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.websocket import router as websocket_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(pages_router)
app.include_router(auth_router)
app.include_router(chat_router)

app.include_router(websocket_router)