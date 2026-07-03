from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/")
async def index():
    return FileResponse("app/static/index.html")


@router.get("/auth")
async def auth():
    return FileResponse("app/static/auth.html")