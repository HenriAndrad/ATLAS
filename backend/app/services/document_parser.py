import io


class DocumentParseError(Exception):
    """Erro ao processar o documento enviado."""


def parse_word_pairs(content: bytes, filename: str) -> list[tuple[str, str]]:
    """Extrai pares (palavra original, tradução) de um arquivo onde cada
    linha segue o formato `palavra**tradução`. Suporta .txt e .docx.

    Levanta DocumentParseError se nenhum par válido for encontrado.
    """
    text = _extract_text(content, filename)

    pairs: list[tuple[str, str]] = []
    for line in text.splitlines():
        line = line.strip()
        if not line or "**" not in line:
            continue

        original, _, translated = line.partition("**")
        original = original.strip()
        translated = translated.strip()

        if original and translated:
            pairs.append((original, translated))

    if not pairs:
        raise DocumentParseError(
            "Nenhum par no formato 'palavra**tradução' foi encontrado no arquivo. "
            "Confira se cada linha segue esse padrão."
        )

    return pairs


def _extract_text(content: bytes, filename: str) -> str:
    if filename.lower().endswith(".docx"):
        return _extract_docx_text(content)
    # .txt e qualquer outro formato de texto simples
    return content.decode("utf-8", errors="ignore")


def _extract_docx_text(content: bytes) -> str:
    from docx import Document  # import local: só carrega a lib se for .docx

    document = Document(io.BytesIO(content))
    return "\n".join(paragraph.text for paragraph in document.paragraphs)
