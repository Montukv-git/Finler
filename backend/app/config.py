import os
from pydantic import BaseModel
from functools import lru_cache

class Settings(BaseModel):
    ENV: str = os.getenv("ENV", "development")
    INVEST_API_KEY: str = os.getenv("INVEST_API_KEY", "DEMO_KEY_123")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "DEMO_SECRET_CHANGE_ME")
    SQLITE_URL: str = os.getenv("SQLITE_URL", "sqlite:///./db/finler.db")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")

@lru_cache
def get_settings() -> Settings:
    return Settings()
