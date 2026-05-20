"""Tests para verificar que el modelo entrenado existe y funciona correctamente."""
import os
import sys
import joblib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'app'))

BASE_DIR = os.path.join(os.path.dirname(__file__), '..')
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'trained_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'models', 'tfidf_vectorizer.pkl')


def test_model_file_exists():
    assert os.path.exists(MODEL_PATH), "El modelo no existe en models/"

def test_vectorizer_file_exists():
    assert os.path.exists(VECTORIZER_PATH), "El vectorizador no existe en models/"

def test_model_loads():
    model = joblib.load(MODEL_PATH)
    assert model is not None

def test_vectorizer_loads():
    vectorizer = joblib.load(VECTORIZER_PATH)
    assert vectorizer is not None

def test_model_has_classes():
    model = joblib.load(MODEL_PATH)
    assert hasattr(model, 'classes_')
    assert 0 in model.classes_ and 1 in model.classes_

def test_vectorizer_has_vocabulary():
    vectorizer = joblib.load(VECTORIZER_PATH)
    assert len(vectorizer.vocabulary_) > 0
