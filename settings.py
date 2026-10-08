from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class ConnectorSettings(BaseSettings):
    host: str
    port: int
    database: str
    user: str
    password: SecretStr
    
    model_config = SettingsConfigDict(env_file=".env", env_prefix="PG_", env_file_encoding="utf-8")
    
    
settings = ConnectorSettings()