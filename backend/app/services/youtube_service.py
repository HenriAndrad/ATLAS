import re

import httpx

_ID_PATTERNS = [
    r"(?:youtube\.com/watch\?v=)([\w-]{11})",
    r"(?:youtu\.be/)([\w-]{11})",
    r"(?:youtube\.com/embed/)([\w-]{11})",
    r"(?:youtube\.com/shorts/)([\w-]{11})",
]


class YoutubeError(Exception):
    """Erro ao processar um link do YouTube."""


def extract_video_id(url: str) -> str:
    for pattern in _ID_PATTERNS:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise YoutubeError("Não foi possível identificar o ID do vídeo nesse link do YouTube.")


async def fetch_oembed_info(video_id: str) -> tuple[str, str | None]:
    """Busca título e thumbnail via oEmbed público do YouTube — não
    precisa de chave de API, só funciona pra vídeos públicos/não listados.
    """
    watch_url = f"https://www.youtube.com/watch?v={video_id}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://www.youtube.com/oembed",
            params={"url": watch_url, "format": "json"},
        )

    if response.status_code != 200:
        raise YoutubeError(
            "Não foi possível obter informações desse vídeo — confira se o link está certo "
            "e se o vídeo é público."
        )

    data = response.json()
    return data.get("title", "Vídeo"), data.get("thumbnail_url")
