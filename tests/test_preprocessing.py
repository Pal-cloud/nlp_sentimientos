"""Tests para la función clean_text de app/utils.py"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'app'))

from utils import clean_text


def test_clean_text_minusculas():
    result = clean_text("HELLO WORLD")
    assert result == result.lower()

def test_clean_text_elimina_url():
    result = clean_text("visita https://example.com ahora")
    assert "http" not in result

def test_clean_text_elimina_menciones():
    result = clean_text("hola @usuario como estas")
    assert "@" not in result

def test_clean_text_elimina_html():
    result = clean_text("<b>texto</b> normal")
    assert "<" not in result and ">" not in result

def test_clean_text_solo_letras():
    result = clean_text("texto123 con !@# caracteres")
    assert all(c.isalpha() or c == " " for c in result)

def test_clean_text_cadena_vacia():
    assert clean_text("") == ""

def test_clean_text_no_string():
    assert clean_text(None) == ""

def test_clean_text_elimina_stopwords_en():
    result = clean_text("this is a very good video")
    assert "this" not in result.split()
    assert "is" not in result.split()

def test_clean_text_elimina_stopwords_es():
    result = clean_text("este es un video muy bueno")
    assert "este" not in result.split()
    assert "es" not in result.split()
