from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação, carregadas de variáveis de ambiente / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Vision Translator AI API"
    # Origem do frontend em desenvolvimento (Vite roda por padrão na 5173).
    cors_allowed_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
