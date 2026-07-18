from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    """Confirma que a API está no ar. Usado pelo frontend para validar conexão."""
    return {"status": "ok"}
