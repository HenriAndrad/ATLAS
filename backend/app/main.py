import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router as v1_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

logger = logging.getLogger("atlas")

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Captura qualquer erro não tratado.

    Sem isso, um erro 500 "cru" às vezes não recebe o cabeçalho de CORS
    (comportamento padrão do Starlette), e o navegador mostra um erro de
    CORS confuso em vez do erro real. Registrando aqui, a resposta passa
    pelo CORSMiddleware normalmente. O traceback completo ainda vai pros
    logs do Render, só não é mais exposto pro navegador.
    """
    logger.exception("Erro não tratado em %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Erro interno do servidor."})


@app.on_event("startup")
async def on_startup() -> None:
    if engine is None:
        print("[aviso] DATABASE_URL não configurada — a Biblioteca ficará indisponível.")
        return
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as exc:  # noqa: BLE001
        print(f"[aviso] Não foi possível conectar ao banco de dados: {exc}")

