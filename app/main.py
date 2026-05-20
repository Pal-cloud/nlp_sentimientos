"""
main.py - App Streamlit para detección de mensajes de odio en comentarios de YouTube.
Proyecto: NLP - Análisis de Sentimientos / Hate Speech Detection
"""

import os
import joblib
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from utils import clean_text, classify_toxicity_type

# ── Configuración de la página ────────────────────────────────────────────────
st.set_page_config(
    page_title="Hate Speech Detector",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Rutas a los artefactos del modelo ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "trained_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "tfidf_vectorizer.pkl")


# ── Carga del modelo (cacheado para eficiencia) ───────────────────────────────
@st.cache_resource(show_spinner=False)
def load_artifacts():
    """Carga el modelo y el vectorizador TF-IDF desde disco."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
        return None, None
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    return model, vectorizer


def predict(text: str, model, vectorizer):
    """Devuelve etiqueta y probabilidad para un texto dado."""
    cleaned = clean_text(text)
    X = vectorizer.transform([cleaned])
    label = model.predict(X)[0]
    # Probabilidades disponibles solo para modelos que las soporten
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)[0]
        confidence = proba[1] if label == 1 else proba[0]
    else:
        # LinearSVC → usar decision_function como proxy
        score = model.decision_function(X)[0]
        # Normalizar a [0, 1] con sigmoide simple
        import math
        confidence = 1 / (1 + math.exp(-score)) if label == 1 else 1 / (1 + math.exp(score))
    return int(label), float(confidence)


# ── CSS personalizado ─────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
        .toxic-box {
            background: linear-gradient(135deg, #ff4b4b22, #ff4b4b44);
            border-left: 5px solid #ff4b4b;
            border-radius: 8px;
            padding: 18px 22px;
            margin: 10px 0;
        }
        .safe-box {
            background: linear-gradient(135deg, #00c85322, #00c85344);
            border-left: 5px solid #00c853;
            border-radius: 8px;
            padding: 18px 22px;
            margin: 10px 0;
        }
        .metric-card {
            background: #1e1e2e;
            border-radius: 10px;
            padding: 16px;
            text-align: center;
        }
        .stTextArea textarea { font-size: 15px; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/youtube-play.png", width=70)
    st.title("🛡️ Hate Speech\nDetector")
    st.markdown("---")
    st.markdown(
        """
        ### ¿Cómo funciona?
        1. Escribe o pega un comentario de YouTube.
        2. El modelo analiza el texto automáticamente.
        3. Recibe la clasificación y nivel de confianza.

        ---
        ### Modelo
        - **Vectorización:** TF-IDF
        - **Clasificador:** Logistic Regression / LinearSVC
        - **Dataset:** YouToxic English (1 000 muestras)

        ---
        ### Etiquetas
        | Etiqueta | Significado |
        |---|---|
        | ✅ No tóxico | Comentario seguro |
        | 🚨 Tóxico | Contiene odio/abuso |
        """
    )
    st.markdown("---")
    st.caption("Proyecto académico · NLP · 2025")

# ── Título principal ──────────────────────────────────────────────────────────
st.title("🛡️ Detector de Mensajes de Odio en YouTube")
st.markdown(
    "Analiza comentarios de YouTube y detecta si contienen lenguaje tóxico, "
    "odio o acoso utilizando un modelo de Machine Learning entrenado con datos reales."
)
st.markdown("---")

# ── Carga de artefactos ───────────────────────────────────────────────────────
with st.spinner("Cargando modelo..."):
    model, vectorizer = load_artifacts()

if model is None:
    st.error(
        "⚠️ No se encontraron los artefactos del modelo en `models/`. "
        "Por favor, ejecuta primero el notebook `02_Modelado.ipynb` para entrenar y guardar el modelo."
    )
    st.stop()

# ── Sección principal ─────────────────────────────────────────────────────────
tab1, = st.tabs(["🔍 Análisis Individual"])

# ════════════════════════════════════════════════════════════════════════════════
# Análisis individual
# ════════════════════════════════════════════════════════════════════════════════
with tab1:
    col_input, col_result = st.columns([1.2, 1], gap="large")

    with col_input:
        st.subheader("✍️ Introduce un comentario")
        user_text = st.text_area(
            label="Comentario",
            placeholder="Escribe aquí el comentario de YouTube que quieres analizar...",
            height=180,
            label_visibility="collapsed",
        )

        example_col1, example_col2 = st.columns(2)
        with example_col1:
            if st.button("💬 Ejemplo seguro", use_container_width=True):
                user_text = "This video is amazing! Really well explained, thank you so much."
                st.session_state["example_text"] = user_text
        with example_col2:
            if st.button("⚠️ Ejemplo tóxico", use_container_width=True):
                user_text = "You are so stupid and ugly, nobody wants to see your disgusting face."
                st.session_state["example_text"] = user_text

        # Si se cargó un ejemplo, mostrarlo en el text_area
        if "example_text" in st.session_state and not user_text:
            user_text = st.session_state["example_text"]

        analyze_btn = st.button("🔍 Analizar comentario", type="primary", use_container_width=True)

    with col_result:
        st.subheader("📊 Resultado")

        if analyze_btn or ("example_text" in st.session_state and user_text):
            if not user_text.strip():
                st.warning("Por favor, introduce un comentario antes de analizar.")
            else:
                with st.spinner("Analizando..."):
                    label, confidence = predict(user_text, model, vectorizer)

                if label == 1:
                    st.markdown(
                        f"""
                        <div class="toxic-box">
                            <h2 style="color:#ff4b4b; margin:0;">🚨 TÓXICO</h2>
                            <p style="font-size:16px; margin:8px 0 0 0;">
                                Este comentario ha sido clasificado como <b>tóxico o con lenguaje de odio</b>.
                            </p>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )
                else:
                    st.markdown(
                        f"""
                        <div class="safe-box">
                            <h2 style="color:#00c853; margin:0;">✅ NO TÓXICO</h2>
                            <p style="font-size:16px; margin:8px 0 0 0;">
                                Este comentario parece <b>seguro y sin lenguaje ofensivo</b>.
                            </p>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

                # ── Tipo de toxicidad ──────────────────────────────────────
                tox_type = classify_toxicity_type(user_text)

                TYPE_CONFIG = {
                    "machista":           {"icon": "⚧️",  "color": "#e040fb", "label": "Machista"},
                    "racista":            {"icon": "🌍",  "color": "#ff6d00", "label": "Racista"},
                    "sexual":             {"icon": "🔞",  "color": "#f50057", "label": "Sexual"},
                    "insulto":            {"icon": "💢",  "color": "#ff4b4b", "label": "Insulto"},
                    "lenguaje cotidiano": {"icon": "💬",  "color": "#90a4ae", "label": "Lenguaje cotidiano"},
                }
                cfg = TYPE_CONFIG[tox_type]

                st.markdown(
                    f"""
                    <div style="
                        background: {cfg['color']}22;
                        border-left: 5px solid {cfg['color']};
                        border-radius: 8px;
                        padding: 14px 18px;
                        margin-top: 12px;
                    ">
                        <p style="margin:0; font-size:13px; color:{cfg['color']}; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
                            Tipo de contenido detectado
                        </p>
                        <h3 style="margin:4px 0 0 0; color:{cfg['color']};">
                            {cfg['icon']} {cfg['label']}
                        </h3>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                # Leyenda de tipos
                with st.expander("ℹ️ ¿Qué significa cada tipo?"):
                    st.markdown("""
                    | Tipo | Descripción |
                    |---|---|
                    | ⚧️ **Machista** | Lenguaje sexista o discriminatorio hacia la mujer |
                    | 🌍 **Racista** | Contenido basado en raza, etnia o nacionalidad |
                    | 🔞 **Sexual** | Contenido sexual explícito o acoso sexual |
                    | 💢 **Insulto** | Insultos directos, amenazas o lenguaje agresivo |
                    | 💬 **Lenguaje cotidiano** | Sin categoría específica clara |
                    """)

                # Texto preprocesado
                with st.expander("🔬 Ver texto preprocesado"):
                    cleaned = clean_text(user_text)
                    st.code(cleaned if cleaned else "(texto vacío tras preprocesamiento)", language=None)
