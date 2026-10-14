from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.users import router as users_router


app = FastAPI(
    title="My First FastAPI App",
    version="1.0.0"
)

# 1. Определяем список разрешенных адресов.
# React по умолчанию запускается на http://localhost:5173
origins = [
    "http://localhost:5173",     # Стандартный порт Vite + React
    "http://127.0.0.1:5173",
    "http://localhost:3000",     # На случай, если запустишь через Create React App
]

# 2. Добавляем CORS middleware в приложение
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Разрешаем запросы только с этих адресов
    allow_credentials=True,
    allow_methods=["*"],            # Разрешаем любые методы (GET, POST, PUT, DELETE)
    allow_headers=["*"],            # Разрешаем любые заголовки
)

@app.get("/")
async def root():
    return {"Hello": "Это моё первое приложение на FastAPI"}

# Подключаем маршруты пользователей
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
