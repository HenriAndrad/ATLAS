import uuid

import httpx

from app.core.config import settings


class StorageError(Exception):
    """Erro ao enviar um arquivo para o storage."""


MAX_VIDEO_SIZE_BYTES = 80 * 1024 * 1024  # 80 MB


async def upload_video(content: bytes, filename: str, content_type: str) -> str:
    """Envia um arquivo de vídeo para o bucket do Supabase Storage e
    retorna a URL pública dele.
    """
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise StorageError(
            "Armazenamento de vídeos não configurado (SUPABASE_URL / "
            "SUPABASE_SERVICE_ROLE_KEY ausentes)."
        )

    if len(content) > MAX_VIDEO_SIZE_BYTES:
        raise StorageError(
            f"Vídeo muito grande ({len(content) / (1024 * 1024):.1f} MB) — "
            f"o limite é {MAX_VIDEO_SIZE_BYTES // (1024 * 1024)} MB."
        )

    extension = filename.rsplit(".", 1)[-1] if "." in filename else "mp4"
    object_path = f"videos/{uuid.uuid4().hex}.{extension}"

    upload_url = (
        f"{settings.supabase_url}/storage/v1/object/"
        f"{settings.supabase_storage_bucket}/{object_path}"
    )

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            upload_url,
            content=content,
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
                "Content-Type": content_type or "video/mp4",
                "x-upsert": "true",
            },
        )

    if response.status_code not in (200, 201):
        raise StorageError(f"Falha ao enviar o vídeo ({response.status_code}): {response.text}")

    return (
        f"{settings.supabase_url}/storage/v1/object/public/"
        f"{settings.supabase_storage_bucket}/{object_path}"
    )
