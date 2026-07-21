import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.deps import ADMIN_VIRTUAL_USER_ID, get_current_user
from app.db.session import get_session
from app.models.user import User
from app.schemas.auth import AuthResponse, AuthUserOut, LoginRequest, RegisterRequest
from app.services.auth_service import create_token, hash_password, verify_password

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(
    payload: RegisterRequest, session: AsyncSession = Depends(get_session)
) -> AuthResponse:
    if not payload.lgpd_accepted:
        raise HTTPException(
            status_code=422, detail="É necessário aceitar os termos de privacidade (LGPD)."
        )
    if "@" not in payload.email or "." not in payload.email:
        raise HTTPException(status_code=422, detail="E-mail inválido.")
    if len(payload.password) < 6:
        raise HTTPException(status_code=422, detail="A senha precisa ter pelo menos 6 caracteres.")
    if len(payload.username.strip()) < 3:
        raise HTTPException(status_code=422, detail="O usuário precisa ter pelo menos 3 caracteres.")

    existing = await session.execute(
        select(User).where((User.email == payload.email) | (User.username == payload.username))
    )
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="Já existe uma conta com esse e-mail ou usuário.")

    user = User(
        email=payload.email.strip().lower(),
        username=payload.username.strip(),
        password_hash=hash_password(payload.password),
        lgpd_accepted_at=datetime.datetime.now(datetime.timezone.utc),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return AuthResponse(
        token=create_token(user.id),
        user=AuthUserOut(id=user.id, email=user.email, username=user.username, is_admin=False),
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    # Login de administrador: reconhecido pelas credenciais de ambiente,
    # sem precisar de conta na tabela de usuários.
    if (
        settings.admin_password
        and payload.username == settings.admin_username
        and payload.password == settings.admin_password
    ):
        return AuthResponse(
            token=create_token(ADMIN_VIRTUAL_USER_ID),
            user=AuthUserOut(
                id=ADMIN_VIRTUAL_USER_ID,
                email="admin@atlas",
                username=settings.admin_username,
                is_admin=True,
            ),
        )

    result = await session.execute(select(User).where(User.username == payload.username))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

    return AuthResponse(
        token=create_token(user.id),
        user=AuthUserOut(id=user.id, email=user.email, username=user.username, is_admin=False),
    )


@router.get("/me", response_model=AuthUserOut)
async def me(current_user: AuthUserOut = Depends(get_current_user)) -> AuthUserOut:
    return current_user
