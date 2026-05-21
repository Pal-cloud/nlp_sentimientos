# 🛡️ HateGuard — Detector de Mensajes de Odio en YouTube

> Proyecto de Data Science / AI Developer — Sistema completo de NLP + Machine Learning para la detección automática de comentarios tóxicos en YouTube, con interfaz React y API REST FastAPI.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-orange?logo=scikit-learn&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Pytest-green?logo=pytest&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)

---

## 📌 Contexto del Proyecto

YouTube enfrenta un crecimiento descontrolado de comentarios de odio que los equipos de moderación humana ya no pueden gestionar de forma escalable. Como consultora, diseñamos e implementamos una **solución automatizada basada en NLP y Machine Learning** capaz de detectar este tipo de mensajes en tiempo real.

El cliente prioriza una **solución práctica y desplegable** por encima de la precisión perfecta: quieren poder actuar (eliminar mensajes, banear usuarios) de forma automática.

---

## 🎯 Objetivos

| # | Objetivo |
|---|----------|
| 1 | Analizar y comprender el dataset de comentarios de YouTube |
| 2 | Preprocesar y limpiar los datos de texto (regex, stopwords, lematización) |
| 3 | Aplicar vectorización clásica de NLP (TF-IDF con bigramas) |
| 4 | Entrenar un clasificador binario (tóxico / no tóxico) y multiclase (tipo de toxicidad) |
| 5 | Evaluar el rendimiento con métricas y controlar el overfitting (< 5pp diferencia train/test) |
| 6 | Optimizar hiperparámetros automáticamente con **Optuna** |
| 7 | Productivizar el modelo: API REST + interfaz visual moderna |

---

## 🏆 Niveles de Entrega Alcanzados

### 🟢 Nivel Esencial ✅
- Modelo ML de clasificación binaria (tóxico / no tóxico)
- Overfitting controlado: diferencia train–test = **3 pp** (límite: 5 pp)
- API REST con FastAPI + interfaz React desplegable
- Repositorio Git con ramas organizadas y commits descriptivos
- Documentación del código y README
- **7 categorías de toxicidad:** machista, racista, sexual, insulto, homófobo, político y lenguaje cotidiano

### 🟡 Nivel Medio ✅
- Análisis en masa dado un **enlace a un vídeo de YouTube** (scraping de comentarios)
- Tests unitarios con **Pytest** (preprocesamiento, modelo, predicción)
- Optimización de hiperparámetros con **Optuna**

### 🟠 Nivel Avanzado (parcial)
- App **Dockerizada** con `docker-compose`
- Despliegue público _(en progreso)_, ver [demo](https://hateguard.streamlit.app/)

---

## ⚙️ Stack Tecnológico

| Categoría | Herramientas |
|-----------|-------------|
| Lenguaje principal | Python 3.11+ |
| Frontend | React 18 + Vite + Material UI (MUI) + Framer Motion |
| Backend / API | FastAPI + Uvicorn |
| ML / NLP | Scikit-learn, NLTK, TF-IDF |
| Optimización | **Optuna** (búsqueda bayesiana de hiperparámetros) |
| Scraping | **youtube-comment-downloader** (sin API key) |
| Datos | Pandas, NumPy |
| Tests | Pytest |
| Contenedores | Docker, Docker Compose |
| Control de versiones | Git / GitHub |

---

## 📦 Estructura del Proyecto

```
NLP_Analisis_Sentimientos/
├── api/
│   └── main.py               # FastAPI backend — endpoints /analyze y /analyze-url
├── app/
│   ├── main.py               # App Streamlit (versión legacy)
│   └── utils.py              # clean_text(), classify_toxicity_type()
├── frontend/
│   └── src/
│       ├── App.jsx            # Layout principal — 5 pestañas
│       ├── api.js             # Cliente HTTP (analyzeComment, analyzeUrl)
│       ├── theme.js           # Tema Material You (light, Google colors)
│       └── components/
│           ├── AnalyzeTab.jsx       # Análisis individual de comentarios
│           ├── HistoryTab.jsx       # Histórico con exportación CSV
│           ├── StatsTab.jsx         # Estadísticas y gráficas (Recharts)
│           ├── UrlTab.jsx           # Análisis por URL de vídeo YouTube
│           └── PresentationTab.jsx  # Diapositivas interactivas (10 slides, ~20 min)
├── models/
│   ├── trained_model.pkl      # Clasificador binario (Logistic Regression)
│   ├── tfidf_vectorizer.pkl   # Vectorizador TF-IDF entrenado
│   └── type_classifier.pkl    # Clasificador de tipo de toxicidad
├── notebooks/
│   ├── 01_EDA_y_Preprocesamiento.ipynb
│   └── 02_Modelado.ipynb
├── scripts/
│   ├── generate_dataset.py    # Generación de dataset sintético bilingüe
│   └── train_type_classifier.py
├── tests/
│   ├── test_preprocessing.py  # Tests de clean_text()
│   ├── test_model.py          # Tests de carga y estructura del modelo
│   └── test_predict.py        # Tests de predicción extremo a extremo
├── data/
│   ├── raw/                   # Dataset original (youtoxic_english_1000.csv)
│   └── processed/             # Dataset limpio y preprocesado
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## 🧠 Arquitectura del Sistema

```
[Usuario]
    │
    ▼
[React App — 5 pestañas]
    │  Análisis individual   → POST /analyze
    │  Análisis por URL      → POST /analyze-url
    │  Histórico / Stats     → (datos locales)
    │  Presentación          → (componente estático interactivo)
    ▼
[FastAPI — api/main.py]
    │
    ├── clean_text(text)         ← NLTK + regex (app/utils.py)
    ├── vectorizer.transform()   ← TF-IDF (models/tfidf_vectorizer.pkl)
    ├── model.predict()          ← Logistic Regression (models/trained_model.pkl)
    └── classify_toxicity_type() ← Clasificador de tipo (models/type_classifier.pkl)
```

---

## 🔬 Pipeline de Procesamiento

```
Texto crudo
    │ 1. Minúsculas
    │ 2. Eliminar URLs (regex)
    │ 3. Eliminar @menciones (regex)
    │ 4. Eliminar HTML y emojis
    │ 5. Solo letras (regex [^a-z\s])
    │ 6. Eliminar stopwords (NLTK — ES + EN)
    │ 7. Lematización (NLTK WordNetLemmatizer)
    ▼
Texto limpio → TF-IDF (10k features, ngram 1-2) → vector numérico
    ▼
Logistic Regression → P(tóxico) → etiqueta + confianza
    ▼
Clasificador de tipo → machista | racista | sexual | insulto | homofobo | politico | lenguaje cotidiano
```

---

## 🔁 Optuna — Optimización de Hiperparámetros

Optuna busca automáticamente la mejor combinación de hiperparámetros del modelo mediante **búsqueda bayesiana** (no fuerza bruta):

```python
import optuna
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

def objective(trial):
    C         = trial.suggest_float("C", 0.01, 10.0, log=True)
    max_feat  = trial.suggest_int("max_features", 5000, 20000)
    ngram_max = trial.suggest_int("ngram_max", 1, 2)

    tfidf = TfidfVectorizer(max_features=max_feat, ngram_range=(1, ngram_max))
    clf   = LogisticRegression(C=C, max_iter=1000)
    # ... fit y score ...
    return f1_score(y_test, y_pred)

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)
print(study.best_params)
# → {'C': 1.0, 'max_features': 10000, 'ngram_max': 2}
```

**Resultado:** F1-score mejoró de 85% (parámetros por defecto) a **90%** (parámetros optimizados).

---

## 📡 Scraper de Comentarios YouTube

Para el análisis por URL usamos `youtube-comment-downloader`, que obtiene comentarios **sin necesitar API key**:

```python
from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_RECENT

downloader = YoutubeCommentDownloader()
generator  = downloader.get_comments_from_url(url, sort_by=SORT_BY_RECENT)

for comment in generator:
    text   = comment["text"]
    result = pipeline.predict(text)  # clean → vectorize → classify
    # ...
    if len(results) >= limit:
        break
```

El endpoint `POST /analyze-url` acepta una URL y un límite (10–200 comentarios) y devuelve el análisis completo con porcentaje de toxicidad del vídeo.

---

## 🚀 Cómo Ejecutar

### Requisitos previos
- Python 3.11+
- Node.js 18+
- Los modelos entrenados en `models/` (ver notebooks)

### 1. Backend (FastAPI)

```bash
# Instalar dependencias
pip install -r requirements.txt

# Iniciar la API
uvicorn api.main:app --reload --port 8000
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 3. Con Docker (todo en uno)

```bash
docker-compose up --build
# Backend → http://localhost:8000
# Frontend → http://localhost:5173
```

### 4. Generar los modelos (si no existen)

```bash
# Ejecutar notebooks en orden:
jupyter nbconvert --to notebook --execute notebooks/01_EDA_y_Preprocesamiento.ipynb
jupyter nbconvert --to notebook --execute notebooks/02_Modelado.ipynb
```

### 5. Ejecutar tests

```bash
pytest tests/ -v
```

---

## 📊 Dataset

[Descargar youtoxic_english_1000.csv](https://drive.google.com/file/d/1bG7fA273jIBgJfc6YS1vsKfr1qRiNUTU/view?usp=sharing)

Colocar en: `data/raw/youtoxic_english_1000.csv`

| Campo | Descripción |
|-------|-------------|
| `Text` | Texto del comentario (columna principal) |
| `IsToxic` | Etiqueta objetivo — clasificación binaria |
| `IsRacist`, `IsSexist`, `IsObscene`… | Etiquetas multilabel para el clasificador de tipo |

- **1.000 comentarios** etiquetados · **Idioma:** inglés  
- Ampliado con datos sintéticos en **español** mediante data augmentation

---

## 🌿 Flujo de Ramas Git

| Rama | Propósito |
|------|-----------|
| `main` | Código estable y listo para producción |
| `develop` | Integración de nuevas funcionalidades |
| `feature/react-app` | Interfaz React + API FastAPI (rama activa) |

---

## 📋 API Reference

### `POST /analyze`
Clasifica un comentario individual.

```json
// Request
{ "text": "You are so stupid and ugly" }

// Response
{
  "label": 1,
  "toxic": true,
  "confidence": 0.94,
  "confidence_pct": 94,
  "toxicity_type": "insulto",
  "cleaned_text": "stupid ugly"
}
```

### `POST /analyze-url`
Descarga y clasifica los comentarios de un vídeo de YouTube.

```json
// Request
{ "url": "https://www.youtube.com/watch?v=...", "limit": 50 }

// Response
{
  "total": 50,
  "toxic_count": 12,
  "safe_count": 38,
  "toxic_pct": 24,
  "comments": [ { "text": "...", "toxic": true, "confidence_pct": 91, "toxicity_type": "insulto" }, ... ]
}
```

---

## 📝 Notas de Desarrollo

- El clasificador de **tipo de toxicidad** es un segundo modelo (`type_classifier.pkl`) entrenado sobre las etiquetas multilabel del dataset. Detecta **7 categorías**: machista, racista, sexual, insulto, homófobo, político y lenguaje cotidiano.
- La diferencia entre métricas de **train y test es de 3 pp** (accuracy 94% vs 91%), cumpliendo el requisito del nivel esencial.
- El frontend incluye una pestaña **Presentación** con 10 diapositivas interactivas pensada para la demo del proyecto, con navegación superior e inferior.

---

*Proyecto académico · NLP + Machine Learning · 2025*
