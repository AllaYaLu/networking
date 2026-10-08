from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from settings import ConnectorSettings

settings = ConnectorSettings()

# Сборка строки подключения
# Подстраховка: если в настройках стоит порт 5432, мы принудительно меняем его на твой рабочий 5434
db_port = 5434 if str(settings.port) in ("5432", "") else settings.port

DATABASE_URL = (
    f"postgresql+asyncpg://"
    f"{settings.user}:{settings.password.get_secret_value()}"
    f"@{settings.host}:{db_port}/{settings.database}"
)

# В SQLAlchemy V2 аргумент future=True больше не нужен и удалён
engine = create_async_engine(DATABASE_URL, echo=True)

# Современный способ создания фабрики асинхронных сессий
pg_session = async_sessionmaker(bind=engine, expire_on_commit=False)

async def get_db_session() -> AsyncSession:
    # Использование конструкции async with гарантирует автоматическое закрытие сессии
    async with pg_session() as session:
        yield session
