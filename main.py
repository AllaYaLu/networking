from fastapi import FastAPI
from api.v1.users import router as users_router

app = FastAPI(
    title="My First FastAPI App",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"Hello": "Это моё первое приложение на FastAPI"}

# Подключаем маршруты пользователей
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
