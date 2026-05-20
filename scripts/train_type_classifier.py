"""
train_type_classifier.py
Trains a multi-class toxicity TYPE classifier (machista / racista / sexual / insulto / normal)
and saves it to models/type_classifier.pkl alongside its own TF-IDF pipeline.

Run from the project root:
    python scripts/train_type_classifier.py
"""

import os
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ── Labeled dataset ────────────────────────────────────────────────────────────
SAMPLES = {
    "machista": [
        # ES
        "las mujeres deben obedecer al hombre",
        "las mujeres no saben manejar",
        "vuelve a la cocina eres una mujer",
        "las feministas son unas locas histéricas",
        "esa mujer es una zorra de la peor especie",
        "las hembras solo sirven para una cosa",
        "cierra la boca eres solo una mujer",
        "eres demasiado emotiva para pensar con lógica",
        "las mujeres no deberían votar ni opinar",
        "eres inferior al hombre por naturaleza",
        "una mujer exitosa es solo una amenaza para la sociedad",
        "las chicas no entienden de deportes ni de tecnología",
        "deberías estar en casa cuidando a los hijos",
        "eres muy histérica típica de mujeres",
        "las mujeres no deberían estar en política",
        # EN
        "women belong in the kitchen not in the office",
        "she is just a stupid bitch who cannot think",
        "women are too emotional to lead",
        "feminists are crazy man hating women",
        "girls are not good at math or science",
        "she only got the job because she is a woman",
        "women should obey their husbands",
        "she is just a slut looking for attention",
        "women are inferior to men in every way",
        "go back to the kitchen where you belong",
        "women drivers are a danger on the road",
        "she cannot handle pressure typical woman",
        "females are just too weak for this job",
        "all feminists are ugly man haters",
        "women should not be in leadership positions",
    ],
    "racista": [
        # ES
        "los negros son todos unos criminales",
        "vuelve a tu país extranjero de mierda",
        "los inmigrantes son una plaga que hay que deportar",
        "los moros no pertenecen aquí",
        "tu raza es inferior a la mía",
        "los gitanos solo roban y engañan",
        "los sudacas vienen a quitarnos el trabajo",
        "hay razas superiores e inferiores es un hecho",
        "los chinos son todos iguales no se puede confiar",
        "los negros son menos inteligentes por genética",
        "los árabes son todos terroristas",
        "los judíos controlan todo el dinero del mundo",
        "los latinos son todos delincuentes",
        "los asiáticos no saben conducir",
        "la inmigración es lo peor que le ha pasado a este país",
        # EN
        "black people are all criminals and thugs",
        "go back to your country you do not belong here",
        "immigrants are a plague that needs to be deported",
        "white race is superior to all others",
        "all arabs are terrorists and should be banned",
        "jews control all the money in the world",
        "mexicans are all drug dealers and criminals",
        "asian people are all the same you cannot trust them",
        "black people are less intelligent by nature",
        "deport all immigrants they are stealing our jobs",
        "this country was better before all the foreigners came",
        "people from that race are genetically inferior",
        "all latinos are gang members and drug dealers",
        "the white race must stay pure",
        "these foreigners are ruining our culture",
    ],
    "sexual": [
        # ES
        "te voy a violar eres una puta",
        "mándame fotos desnuda ahora mismo",
        "eres tan sexy que solo sirves para el sexo",
        "me excitas mucho quiero hacerte cosas",
        "eso está muy buena mándame un video íntimo",
        "te voy a hacer cosas que no te van a gustar",
        "solo eres buena para una cosa en la cama",
        "quiero verte desnuda eres un objeto sexual",
        "te voy a tocar donde quiera aunque no quieras",
        "manda nudes o te elimino",
        "acoso sexual no es para tanto aprende a recibir piropos",
        "la violación a veces es culpa de la mujer por como viste",
        "me tienes loco con ese cuerpo eres mi juguete sexual",
        "te voy a mandar fotos de mi pene te va a gustar",
        "qué cuerpazo tienes eres un objeto de placer",
        # EN
        "I want to rape you you dirty slut",
        "send me naked pictures right now",
        "you are only good for one thing in bed",
        "I will touch you wherever I want",
        "you are just a sexual object for my pleasure",
        "send nudes or I will expose you",
        "sexual harassment is just a compliment learn to take it",
        "I am going to do things to you that you will not enjoy",
        "you dress like that so you are asking for it",
        "I masturbate to your pictures every night",
        "your body was made for sex and nothing else",
        "I will send you explicit pictures you will love it",
        "you are a pornstar in my fantasies",
        "I want to do explicit things to your body",
        "you are nothing but a sex object to me",
    ],
    "insulto": [
        # ES
        "eres un idiota completo sin cerebro",
        "cállate estúpido imbécil inútil",
        "eres basura humana y un perdedor",
        "muérete nadie te va a echar de menos",
        "te voy a matar si sigues hablando",
        "eres un gusano patético y miserable",
        "suicidate el mundo estaría mejor sin ti",
        "eres un asco de persona y un fracasado",
        "cierra la boca pedazo de mierda",
        "eres un cerdo asqueroso y violento",
        "mereces sufrir por ser tan estúpido",
        "eres un criminal y un desgraciado",
        "voy a hacerte la vida imposible maldito",
        "eres la escoria de la sociedad",
        "no sirves para nada inútil miserable",
        # EN
        "you are a complete idiot with no brain",
        "shut up you stupid worthless moron",
        "you are human garbage and a total loser",
        "kill yourself nobody will miss you",
        "I will kill you if you keep talking",
        "you are a pathetic little worm",
        "die nobody wants you here",
        "you are the worst person alive total trash",
        "shut your mouth piece of garbage",
        "you are a disgusting violent pig",
        "you deserve to suffer for being so stupid",
        "you are a criminal and a piece of scum",
        "I will make your life a living hell",
        "you are the scum of society",
        "you are completely useless worthless waste of space",
    ],
    "normal": [
        # ES
        "este video es muy interesante gracias",
        "excelente explicación muy útil para mis estudios",
        "no estoy de acuerdo pero respeto tu opinión",
        "podrías hacer más videos sobre este tema",
        "me encanta la edición y la música que usas",
        "aprendí mucho con este video gracias",
        "tengo una pregunta sobre el tema del video",
        "sigue adelante con el gran trabajo que haces",
        "muy bien explicado y con ejemplos claros",
        "comparto esto con todos mis amigos",
        "tu canal es uno de mis favoritos de youtube",
        "me alegró el día este video gracias",
        "análisis muy equilibrado y reflexivo",
        "la calidad de producción es impresionante",
        "llevas años enseñándonos cosas nuevas gracias",
        "me suscribí y espero más contenido pronto",
        "eres uno de mis creadores favoritos",
        "haces que los temas difíciles sean fáciles",
        "muy buen contenido como siempre",
        "esperando con ansias tu próximo video",
        # EN
        "this video is really interesting thank you so much",
        "great explanation very helpful for my studies",
        "I disagree with this but I respect your view",
        "can you make more videos about this topic please",
        "love the editing and the music choice here",
        "I learned a lot today thank you for sharing",
        "I have a question about the second part",
        "keep up the amazing work you are doing great",
        "this is exactly what I needed thank you",
        "I shared this with all my friends and family",
        "your channel is one of the best on youtube",
        "very well researched and presented content",
        "this helped me understand the topic much better",
        "you have a real talent for teaching people",
        "I have been watching your channel for years",
        "please keep making content like this it is valuable",
        "you make complex topics easy to understand",
        "one of the most informative videos I have seen",
        "highly recommend this channel to everyone",
        "thank you for taking the time to make this content",
    ],
}

# ── Build dataset ──────────────────────────────────────────────────────────────
texts, labels = [], []
for label, sentences in SAMPLES.items():
    # Augment by repeating with slight shuffling (word order variation)
    for sentence in sentences:
        texts.append(sentence)
        labels.append(label)
        # Add 3 augmented copies (word shuffle)
        words = sentence.split()
        for _ in range(3):
            import random
            random.seed(hash(sentence + str(_)))
            shuffled = words[:]
            random.shuffle(shuffled)
            texts.append(" ".join(shuffled))
            labels.append(label)

print(f"Dataset de tipos: {len(texts)} muestras")
for lbl in SAMPLES:
    n = labels.count(lbl)
    print(f"  {lbl}: {n}")

# ── Train ──────────────────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.2, random_state=42, stratify=labels
)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        analyzer="word",
    )),
    ("clf", LogisticRegression(
        C=2.0,
        max_iter=1000,
        random_state=42,
        class_weight="balanced",
    )),
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

print("\nReporte en test:")
print(classification_report(y_test, y_pred))

# ── Save ───────────────────────────────────────────────────────────────────────
os.makedirs("models", exist_ok=True)
joblib.dump(pipeline, "models/type_classifier.pkl")
print("Guardado: models/type_classifier.pkl")
