"""Tests de integración: predicción extremo a extremo usando el modelo entrenado."""
import os
import sys
import joblib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'app'))

from utils import clean_text

BASE_DIR = os.path.join(os.path.dirname(__file__), '..')
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'trained_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'models', 'tfidf_vectorizer.pkl')


def load_model():
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    return model, vectorizer

def predict(text, model, vectorizer):
    cleaned = clean_text(text)
    X = vectorizer.transform([cleaned])
    return model.predict(X)[0]


def test_predice_toxico_en():
    model, vectorizer = load_model()
    assert predict("I hate you worthless trash", model, vectorizer) == 1

def test_predice_toxico_es():
    model, vectorizer = load_model()
    assert predict("eres una basura inutil asquerosa", model, vectorizer) == 1

def test_predice_normal_en():
    model, vectorizer = load_model()
    assert predict("great video thanks for sharing", model, vectorizer) == 0

def test_predice_normal_es():
    model, vectorizer = load_model()
    assert predict("me encanto el contenido sigue asi", model, vectorizer) == 0

def test_prediccion_texto_vacio():
    model, vectorizer = load_model()
    result = predict("", model, vectorizer)
    assert result in [0, 1]
