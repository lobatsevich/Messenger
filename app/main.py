from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.pages import router
from app.api.auth import router as auth_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(router)
app.include_router(auth_router)