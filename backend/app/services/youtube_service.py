import re

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
