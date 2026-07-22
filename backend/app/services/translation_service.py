import httpx

from app.core.config import settings

# Mapeia os códigos de idioma usados pelo frontend (ISO simples) para
# os códigos exigidos pela API da DeepL.
_DEEPL_LANGUAGE_CODES = {
    "pt": "PT-BR",
    "en": "EN-US",
    "es": "ES",
    "de": "DE",
    "fr": "FR",
    "ht": "HT",
}


class TranslationError(Exception):
    """Erro ao chamar o provedor de tradução."""


async def translate_text(
    text: str,
    target_lang: str,
    source_lang: str | None = None,
) -> str:
    """Traduz `text` para `target_lang` usando a API da DeepL.

    Levanta TranslationError se o idioma não for suportado ou a chamada falhar.
    """
    deepl_target = _DEEPL_LANGUAGE_CODES.get(target_lang.lower())
    if deepl_target is None:
        raise TranslationError(f"Idioma de destino não suportado: {target_lang}")

    payload: dict[str, list[str] | str] = {"text": [text], "target_lang": deepl_target}
    if source_lang:
        payload["source_lang"] = source_lang.upper()

    headers = {"Authorization": f"DeepL-Auth-Key {settings.deepl_api_key}"}

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(settings.deepl_api_url, json=payload, headers=headers)

    if response.status_code != 200:
        raise TranslationError(f"DeepL respondeu {response.status_code}: {response.text}")

    data = response.json()
    return data["translations"][0]["text"]
