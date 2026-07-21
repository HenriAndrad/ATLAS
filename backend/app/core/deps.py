from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_session
from app.models.user import User
from app.schemas.auth import AuthUserOut
from app.services.auth_service import read_token

# id reservado pro "usuário virtual" do admin — o admin não tem uma linha
# na tabela users, ele é reconhecido só pelas credenciais de ambiente
# (ADMIN_USERNAME/ADMIN_PASSWORD), conforme decidido no projeto.
ADMIN_VIRTUAL_USER_ID = 0


async def get_current_user(
    authorization: str | None = Header(default=None),
    session: AsyncSession = Depends(get_session),
) -> AuthUserOut:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Não autenticado.")

    token = authorization.removeprefix("Bearer ").strip()
    user_id = read_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada.")

    if user_id == ADMIN_VIRTUAL_USER_ID:
        return AuthUserOut(id=0, email="admin@atlas", username=settings.admin_username, is_admin=True)

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado.")

    return AuthUserOut(id=user.id, email=user.email, username=user.username, is_admin=False)


async def require_admin_user(
    current_user: AuthUserOut = Depends(get_current_user),
) -> AuthUserOut:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Apenas administradores podem fazer isso.")
    return current_user
