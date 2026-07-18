from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação, carregadas de variáveis de ambiente / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Vision Translator AI API"
    # Origem do frontend em desenvolvimento (Vite roda por padrão na 5173).
    cors_allowed_origins: list[str] = ["http://localhost:5173"]

    # Chave gratuita em https://www.deepl.com/pro-api
    deepl_api_key: str = ""
    deepl_api_url: str = "https://api-free.deepl.com/v2/translate"

    # Connection string do Postgres (Supabase). Vazio = recursos de
    # Biblioteca ficam indisponíveis, mas o resto do app funciona normal.
    database_url: str = ""

    # Credenciais da área do administrador. admin_password vazio =
    # área do admin fica desabilitada (todas as requisições retornam 503).
    admin_username: str = "admin"
    admin_password: str = ""


settings = Settings()
