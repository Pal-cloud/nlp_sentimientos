"""
utils.py - Funciones de preprocesamiento para la app Streamlit.
Deben ser idénticas a las usadas durante el entrenamiento del modelo.
"""

import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Descargar recursos necesarios (solo la primera vez)
for resource in ["stopwords", "wordnet", "omw-1.4"]:
    try:
        nltk.data.find(f"corpora/{resource}")
    except LookupError:
        nltk.download(resource, quiet=True)

STOP_WORDS = set(stopwords.words("english")) | set(stopwords.words("spanish"))
lemmatizer = WordNetLemmatizer()


def clean_text(text: str) -> str:
    """
    Limpia y normaliza el texto de entrada.
    Pipeline: minúsculas → sin URLs → sin menciones → sin HTML
              → solo letras → sin stopwords → lematización.
    """
    if not isinstance(text, str):
        return ""

    # Minúsculas
    text = text.lower()
    # Eliminar URLs
    text = re.sub(r"http\S+|www\.\S+", "", text)
    # Eliminar menciones @usuario
    text = re.sub(r"@\w+", "", text)
    # Eliminar etiquetas HTML
    text = re.sub(r"<.*?>", "", text)
    # Eliminar caracteres especiales y números, mantener solo letras y espacios
    text = re.sub(r"[^a-z\s]", "", text)
    # Eliminar espacios múltiples
    text = re.sub(r"\s+", " ", text).strip()

    # Tokenización simple, eliminar stopwords y lematizar
    tokens = [
        lemmatizer.lemmatize(word)
        for word in text.split()
        if word not in STOP_WORDS and len(word) > 2
    ]

    return " ".join(tokens)


# ── Clasificador de tipo de toxicidad ─────────────────────────────────────────
_KEYWORDS = {
    "machista": [
        # ES
        "mujer", "mujeres", "hembra", "feminista", "cocina", "femenino", "fregona",
        "puta", "zorra", "perra", "sumisa", "callar", "inferior", "menor",
        # EN
        "women", "female", "feminist", "kitchen", "bitch", "slut", "whore",
        "sexist", "inferior", "obey", "shut up woman",
    ],
    "racista": [
        # ES
        "raza", "racista", "negro", "moro", "sudaca", "inmigrante", "extranjero",
        "deportar", "deported", "plaga", "inferior", "etnia", "gitano",
        # EN
        "racist", "race", "monkey", "deportar", "deport", "immigrant", "ethnic",
        "nationality", "nationalist", "skin", "white", "black people",
    ],
    "sexual": [
        # ES
        "sexo", "sexual", "porno", "desnudo", "genitales", "masturbacion",
        "violacion", "abusar", "acoso", "toquetear",
        # EN
        "sex", "sexual", "porn", "naked", "rape", "molest", "harass",
        "genitals", "nude", "explicit",
    ],
    "insulto": [
        # ES
        "idiota", "imbecil", "estupido", "inutil", "basura", "mierda",
        "asco", "muerto", "suicida", "desgraciado", "cerdo", "animal",
        "miserable", "gusano", "escoria",
        # EN
        "idiot", "moron", "stupid", "dumb", "garbage", "trash", "loser",
        "freak", "pathetic", "worthless", "die", "kill", "hate", "disgusting",
        "shut up", "fool", "scum",
    ],
}


def classify_toxicity_type(text: str) -> str:
    """
    Clasifica el tipo de toxicidad de un texto.
    Devuelve: 'machista', 'racista', 'sexual', 'insulto' o 'lenguaje cotidiano'.
    Si hay empate o el texto no es tóxico, devuelve 'lenguaje cotidiano'.
    """
    text_lower = text.lower()
    scores = {cat: 0 for cat in _KEYWORDS}

    for cat, keywords in _KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                scores[cat] += 1

    best_cat = max(scores, key=scores.get)
    if scores[best_cat] == 0:
        return "lenguaje cotidiano"
    return best_cat
