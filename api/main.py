"""
api/main.py - FastAPI backend for Hate Speech Detector
Exposes the trained ML models via REST API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, os, math, sys

# ── Allow imports from app/utils.py ──────────────────────────────────────────
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))
from utils import clean_text, classify_toxicity_type  # noqa: E402

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR        = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH      = os.path.join(BASE_DIR, "models", "trained_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "tfidf_vectorizer.pkl")

# ── Load models once at startup ────────────────────────────────────────────────
model      = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="Hate Speech Detector API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ────────────────────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    label: int          # 0 = safe, 1 = toxic
    toxic: bool
    confidence: float   # 0.0 – 1.0
    confidence_pct: int # 0 – 100
    toxicity_type: str  # machista | racista | sexual | insulto | lenguaje cotidiano
    cleaned_text: str


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "Hate Speech Detector API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    text = req.text.strip()
    if not text:
        return AnalyzeResponse(
            label=0, toxic=False, confidence=0.0, confidence_pct=0,
            toxicity_type="lenguaje cotidiano", cleaned_text="",
        )

    cleaned = clean_text(text)
    X = vectorizer.transform([cleaned])
    label = int(model.predict(X)[0])

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)[0]
        confidence = float(proba[1] if label == 1 else proba[0])
    else:
        score = model.decision_function(X)[0]
        confidence = float(
            1 / (1 + math.exp(-score)) if label == 1 else 1 / (1 + math.exp(score))
        )

    tox_type = classify_toxicity_type(text)

    return AnalyzeResponse(
        label=label,
        toxic=label == 1,
        confidence=round(confidence, 4),
        confidence_pct=int(confidence * 100),
        toxicity_type=tox_type,
        cleaned_text=cleaned,
    )
