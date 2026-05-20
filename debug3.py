import joblib, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))
from utils import clean_text
import numpy as np

model = joblib.load('models/trained_model.pkl')
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')

print(f"Modelo: {type(model).__name__}")
print(f"Clases: {model.classes_}")
print(f"Intercept (sesgo base): {model.intercept_}")
print(f"  → Si intercept > 0, tiende a predecir clase 1 (tóxico) por defecto\n")

# Predecir con texto vacío
X_empty = vectorizer.transform([""])
pred_empty = model.predict(X_empty)[0]
proba_empty = model.predict_proba(X_empty)[0]
print(f"Texto vacío → pred={pred_empty}, proba={proba_empty}")

tests = [
    ("great video thanks", 0),
    ("I love this content", 0),
    ("good morning", 0),
    ("me encanta este video", 0),
    ("excelente trabajo", 0),
    ("nice day today", 0),
    ("I hate you worthless", 1),
    ("basura inutil asqueroso", 1),
    ("shut up moron", 1),
    ("eres un idiota", 1),
]

print("\nPredicciones:")
errors = 0
for text, expected in tests:
    cleaned = clean_text(text)
    X = vectorizer.transform([cleaned])
    pred = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    ok = "OK" if pred == expected else "FAIL"
    if pred != expected:
        errors += 1
    print(f"[{ok}] pred={pred}({proba[1]:.2f}) expected={expected} | orig: '{text}' | cleaned: '{cleaned}'")

print(f"\nErrores: {errors}/{len(tests)}")
