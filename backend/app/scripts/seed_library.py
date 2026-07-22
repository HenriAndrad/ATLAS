"""Popula o banco com um conteúdo inicial de exemplo para a Biblioteca.

Rode com: python -m app.scripts.seed_library

Nota: não incluí traduções para o Crioulo Haitiano aqui — prefiro deixar
em branco a arriscar apresentar uma tradução incorreta como se fosse
confiável. O administrador pode completar isso depois (quando a área de
admin existir) ou você pode me passar as traduções certas pra eu adicionar.
"""

import asyncio

from app.db.base import Base
from app.db.session import async_session, engine
from app.models.category import VocabularyCategory
from app.models.translation import WordTranslation
from app.models.word import VocabularyWord

SEED_DATA = [
    {
        "name": "Animais",
        "icon_emoji": "🐾",
        "words": [
            {
                "original_en": "Dog",
                "emoji": "🐶",
                "expected_confidence": 0.7,
                "example_sentence_en": "The dog is playing in the park.",
                "translations": {
                    "pt": ("Cachorro", "O cachorro está brincando no parque."),
                    "es": ("Perro", "El perro está jugando en el parque."),
                    "de": ("Hund", "Der Hund spielt im Park."),
                    "fr": ("Chien", "Le chien joue dans le parc."),
                },
            },
            {
                "original_en": "Cat",
                "emoji": "🐱",
                "expected_confidence": 0.7,
                "example_sentence_en": "The cat is sleeping on the sofa.",
                "translations": {
                    "pt": ("Gato", "O gato está dormindo no sofá."),
                    "es": ("Gato", "El gato está durmiendo en el sofá."),
                    "de": ("Katze", "Die Katze schläft auf dem Sofa."),
                    "fr": ("Chat", "Le chat dort sur le canapé."),
                },
            },
        ],
    },
    {
        "name": "Comida",
        "icon_emoji": "🍽️",
        "words": [
            {
                "original_en": "Apple",
                "emoji": "🍎",
                "expected_confidence": 0.6,
                "example_sentence_en": "I eat an apple every morning.",
                "translations": {
                    "pt": ("Maçã", "Eu como uma maçã toda manhã."),
                    "es": ("Manzana", "Como una manzana cada mañana."),
                    "de": ("Apfel", "Ich esse jeden Morgen einen Apfel."),
                    "fr": ("Pomme", "Je mange une pomme chaque matin."),
                },
            },
            {
                "original_en": "Bottle",
                "emoji": "🍾",
                "expected_confidence": 0.75,
                "example_sentence_en": "Fill the bottle with water.",
                "translations": {
                    "pt": ("Garrafa", "Encha a garrafa com água."),
                    "es": ("Botella", "Llena la botella con agua."),
                    "de": ("Flasche", "Fülle die Flasche mit Wasser."),
                    "fr": ("Bouteille", "Remplis la bouteille d'eau."),
                },
            },
        ],
    },
    {
        "name": "Tecnologia",
        "icon_emoji": "💻",
        "words": [
            {
                "original_en": "Laptop",
                "emoji": "💻",
                "expected_confidence": 0.8,
                "example_sentence_en": "I work on my laptop every day.",
                "translations": {
                    "pt": ("Notebook", "Eu trabalho no meu notebook todos os dias."),
                    "es": ("Portátil", "Trabajo en mi portátil todos los días."),
                    "de": ("Laptop", "Ich arbeite jeden Tag an meinem Laptop."),
                    "fr": (
                        "Ordinateur portable",
                        "Je travaille sur mon ordinateur portable tous les jours.",
                    ),
                },
            },
            {
                "original_en": "Cell phone",
                "emoji": "📱",
                "expected_confidence": 0.85,
                "example_sentence_en": "My cell phone battery is low.",
                "translations": {
                    "pt": ("Celular", "A bateria do meu celular está fraca."),
                    "es": ("Celular", "La batería de mi celular está baja."),
                    "de": ("Handy", "Der Akku meines Handys ist schwach."),
                    "fr": (
                        "Téléphone portable",
                        "La batterie de mon téléphone portable est faible.",
                    ),
                },
            },
        ],
    },
]


async def seed() -> None:
    if engine is None or async_session is None:
        print("DATABASE_URL não configurada — configure o .env antes de rodar o seed.")
        return

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        for category_data in SEED_DATA:
            category = VocabularyCategory(
                name=category_data["name"],
                icon_emoji=category_data["icon_emoji"],
            )
            session.add(category)
            await session.flush()  # garante category.id antes de criar as palavras

            for word_data in category_data["words"]:
                word = VocabularyWord(
                    category_id=category.id,
                    original_en=word_data["original_en"],
                    emoji=word_data["emoji"],
                    expected_confidence=word_data["expected_confidence"],
                    example_sentence_en=word_data["example_sentence_en"],
                )
                session.add(word)
                await session.flush()

                for lang_code, (text, example) in word_data["translations"].items():
                    session.add(
                        WordTranslation(
                            word_id=word.id,
                            language_code=lang_code,
                            translated_text=text,
                            example_sentence_translated=example,
                        )
                    )

        await session.commit()

    print("Seed concluído: 3 categorias, 6 palavras.")


if __name__ == "__main__":
    asyncio.run(seed())
