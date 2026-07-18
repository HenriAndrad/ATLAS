import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.core.config import settings

_security = HTTPBasic()


def require_admin(credentials: HTTPBasicCredentials = Depends(_security)) -> str:
    """Dependência do FastAPI que exige usuário/senha de administrador válidos.

    Usa secrets.compare_digest para evitar timing attacks na comparação.
    """
    if not settings.admin_password:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Área do administrador não configurada (defina ADMIN_PASSWORD).",
        )

    is_correct_username = secrets.compare_digest(credentials.username, settings.admin_username)
    is_correct_password = secrets.compare_digest(credentials.password, settings.admin_password)

    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais de administrador inválidas.",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username
