from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker

from settings import settings as SETTINGS

connection_string = (f"postgresql+asyncpg//{SETTING.user}"
                     f":{SETTING.password.get_secret_value()}"
                     f"@{SETTINGS.host}:{SETTINGS.port}/{SETTINGS.database}")

engine = create_async_engine(connection_string, future=True, echo=True)
pg_session = sessionmaker(bind=engine, class = AsyncEngine, expire_on_commit=False)