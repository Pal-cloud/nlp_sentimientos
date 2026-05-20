"""
Script para generar un dataset de entrenamiento mucho más rico y variado,
cubriendo más vocabulario tóxico en inglés y español.
"""
import csv, random, uuid

random.seed(42)

# ── INGLÉS TÓXICO ─────────────────────────────────────────────────────────────
toxic_en = [
    "you are an absolute idiot",
    "shut up you stupid moron",
    "go to hell you piece of garbage",
    "you are dumb and worthless",
    "nobody likes you get lost",
    "you are a complete loser",
    "die in a fire you freak",
    "you are disgusting and pathetic",
    "get out of here you filthy animal",
    "you are the worst person alive",
    "I hate everything about you",
    "you should be ashamed of yourself",
    "what a brainless idiot you are",
    "you are a waste of space",
    "go back to where you came from",
    "you fat ugly piece of trash",
    "your kind does not belong here",
    "people like you make me sick",
    "you are a racist sexist pig",
    "I hope you suffer for this",
    "kill yourself nobody wants you here",
    "you are a disgusting human being",
    "worthless trash like you should disappear",
    "stop talking you brain dead fool",
    "you are beyond stupid and ignorant",
    "what a pathetic excuse for a person",
    "you are a coward and a liar",
    "I hate you with every fiber of my being",
    "you are an embarrassment to humanity",
    "crawl back under your rock you troll",
    "dumb idiot cannot understand anything",
    "you deserve nothing but misery",
    "filthy creep stay away from here",
    "you are a hateful bigot",
    "racist garbage does not belong here",
    "you are a violent thug",
    "deport all immigrants they are criminals",
    "women are inferior and should obey",
    "gay people are disgusting freaks",
    "religion of hate and violence",
    "you are a terrorist supporter",
    "scum of the earth that is what you are",
    "disgusting pig I hope you rot",
    "you make me want to vomit",
    "shut your mouth before I shut it for you",
    "stupid sheep following fake news",
    "get out you parasite",
    "your family should be ashamed of you",
    "you are a cancer on society",
    "nobody will ever love someone like you",
    "blind fool cannot see the truth",
    "you are a pathetic little worm",
    "go cry in a corner loser",
    "absolute garbage opinion from an absolute moron",
    "you should not be allowed to speak",
    "braindead zombie with no original thought",
    "you are a toxic excuse for a human",
    "vile creature get out of here",
    "I hope bad things happen to you",
    "you are so dumb it hurts",
    "worthless piece of human garbage",
]

# ── ESPAÑOL TÓXICO ────────────────────────────────────────────────────────────
toxic_es = [
    "eres un idiota completo cierra la boca",
    "cállate estúpido imbécil",
    "vete al infierno pedazo de basura",
    "eres tonto e inútil",
    "nadie te quiere lárgate de aquí",
    "eres un perdedor de mierda",
    "muérete eres un desgraciado",
    "eres asqueroso y patético",
    "lárgate de aquí animal inmundo",
    "eres la peor persona que existe",
    "odio todo lo que representas",
    "deberías darte vergüenza",
    "qué imbécil sin cerebro eres",
    "eres un desperdicio de espacio",
    "vuelve a tu país extranjero de mierda",
    "gordo feo pedazo de basura",
    "tu gente no pertenece aquí",
    "gente como tú me da asco",
    "eres un racista sexista de mierda",
    "espero que sufras por esto",
    "suicidate nadie te quiere aquí",
    "eres un ser humano asqueroso",
    "basura inútil como tú debería desaparecer",
    "deja de hablar imbécil sin cerebro",
    "eres increíblemente estúpido e ignorante",
    "qué excusa más patética de persona",
    "eres un cobarde y un mentiroso",
    "te odio con toda mi alma",
    "eres una vergüenza para la humanidad",
    "vuelve a tu cueva troll miserable",
    "idiota que no entiende nada",
    "mereces solamente miseria y sufrimiento",
    "asqueroso aléjate de aquí",
    "eres un fanático lleno de odio",
    "basura racista no perteneces aquí",
    "eres un delincuente violento",
    "deportad a todos los inmigrantes son criminales",
    "las mujeres son inferiores y deben obedecer",
    "los gays son unos enfermos asquerosos",
    "religión de odio y violencia",
    "eres un simpatizante del terrorismo",
    "escoria de la tierra eso es lo que eres",
    "cerdo asqueroso espero que te pudras",
    "me das ganas de vomitar",
    "cierra la boca antes de que te la cierre yo",
    "oveja estúpida siguiendo noticias falsas",
    "lárgate parásito inútil",
    "tu familia debería avergonzarse de ti",
    "eres un cáncer para la sociedad",
    "nadie te va a querer jamás",
    "ciego ignorante que no ve la verdad",
    "eres un gusano patético y miserable",
    "ve a llorar a un rincón perdedor",
    "opinión basura de un completo moron",
    "no deberías tener permiso para hablar",
    "zombi sin cerebro sin pensamiento propio",
    "eres una excusa tóxica de ser humano",
    "criatura vil lárgate de aquí",
    "espero que te pasen cosas malas",
    "eres tan estúpido que duele",
    "miserable pedazo de basura humana",
]

# ── INGLÉS NORMAL ─────────────────────────────────────────────────────────────
normal_en = [
    "this video is really interesting thank you",
    "great explanation very helpful for my studies",
    "I really enjoyed this content keep it up",
    "I disagree with this point but I respect your view",
    "can you make more videos about this topic",
    "this made my day thank you so much",
    "very well explained I learned a lot today",
    "I have a question about the second part",
    "love the editing and the music choice",
    "subscribed and looking forward to more content",
    "amazing work keep going you are doing great",
    "this is exactly what I needed thank you",
    "I shared this with all my friends",
    "your channel is one of the best on youtube",
    "please do a follow up video on this subject",
    "the information here is so valuable and clear",
    "I watch every single one of your videos",
    "this helped me understand the topic much better",
    "fantastic content as always well done",
    "you explained it in a way I finally understand",
    "keep up the amazing work you inspire me",
    "one of the most informative videos I have seen",
    "thank you for taking the time to make this",
    "I learned something new today because of you",
    "this deserves way more views incredible work",
    "I have been watching your channel for years",
    "the production quality is outstanding",
    "please keep making content like this",
    "so well researched and presented",
    "you are one of my favorite creators",
    "I appreciate how much effort you put in",
    "this changed my perspective on the topic",
    "very balanced and thoughtful analysis",
    "I will definitely share this with my class",
    "looking forward to your next upload",
    "the examples you used were very helpful",
    "clear concise and very informative",
    "I have learned more here than in school",
    "you deserve so many more subscribers",
    "every video you make is better than the last",
    "thank you for explaining this so clearly",
    "great work as always keep it up",
    "this is the best explanation I have found",
    "I really appreciate your hard work",
    "you have a real talent for teaching",
    "this was both entertaining and educational",
    "your passion for this topic really shows",
    "I cannot wait for your next video",
    "highly recommend this channel to everyone",
    "you make complex topics easy to understand",
]

# ── ESPAÑOL NORMAL ────────────────────────────────────────────────────────────
normal_es = [
    "este video es muy interesante gracias",
    "excelente explicación muy útil para mis estudios",
    "me encantó el contenido sigue así",
    "no estoy de acuerdo pero respeto tu opinión",
    "podrías hacer más videos sobre este tema",
    "esto me alegró el día muchas gracias",
    "muy bien explicado aprendí mucho hoy",
    "tengo una pregunta sobre la segunda parte",
    "me encanta la edición y la música",
    "me suscribí y espero más contenido",
    "trabajo increíble sigue adelante lo haces genial",
    "esto es exactamente lo que necesitaba gracias",
    "compartí esto con todos mis amigos",
    "tu canal es uno de los mejores de youtube",
    "por favor haz un video de seguimiento sobre esto",
    "la información aquí es muy valiosa y clara",
    "veo todos y cada uno de tus videos",
    "esto me ayudó a entender el tema mucho mejor",
    "contenido fantástico como siempre bien hecho",
    "lo explicaste de una manera que por fin entiendo",
    "sigue con el trabajo increíble me inspiras",
    "uno de los videos más informativos que he visto",
    "gracias por tomarte el tiempo de hacer esto",
    "hoy aprendí algo nuevo gracias a ti",
    "esto merece muchas más vistas increíble trabajo",
    "llevo años viendo tu canal y siempre aprendo",
    "la calidad de producción es impresionante",
    "por favor sigue haciendo contenido así",
    "muy bien investigado y presentado",
    "eres uno de mis creadores favoritos",
    "valoro mucho el esfuerzo que pones en esto",
    "esto cambió mi perspectiva sobre el tema",
    "análisis muy equilibrado y reflexivo",
    "definitivamente compartiré esto con mi clase",
    "espero con ansias tu próxima subida",
    "los ejemplos que usaste fueron muy útiles",
    "claro conciso y muy informativo",
    "he aprendido más aquí que en la escuela",
    "mereces muchos más suscriptores",
    "cada video que haces es mejor que el anterior",
    "gracias por explicar esto tan claramente",
    "gran trabajo como siempre sigue así",
    "esta es la mejor explicación que he encontrado",
    "aprecio mucho tu arduo trabajo",
    "tienes un talento real para enseñar",
    "esto fue tanto entretenido como educativo",
    "tu pasión por este tema realmente se nota",
    "no puedo esperar a tu próximo video",
    "recomiendo mucho este canal a todos",
    "haces que los temas complejos sean fáciles de entender",
]

# ── Generar dataset ────────────────────────────────────────────────────────────
all_toxic = toxic_en + toxic_es
all_normal = normal_en + normal_es

rows = []
for i in range(1000):
    is_toxic = random.random() < 0.4
    if is_toxic:
        text = random.choice(all_toxic)
        is_abusive = random.randint(0, 1)
        is_threat = random.randint(0, 1)
        is_provocative = random.randint(0, 1)
        is_obscene = random.randint(0, 1)
        is_hate = random.randint(0, 1)
        is_racist = random.randint(0, 1)
        is_nationalist = random.randint(0, 1)
        is_sexist = random.randint(0, 1)
        is_homophobic = random.randint(0, 1)
        is_religious = random.randint(0, 1)
        is_radicalism = random.randint(0, 1)
    else:
        text = random.choice(all_normal)
        is_abusive = is_threat = is_provocative = is_obscene = is_hate = 0
        is_racist = is_nationalist = is_sexist = is_homophobic = is_religious = is_radicalism = 0

    rows.append({
        'CommentId': str(uuid.uuid4()),
        'VideoId': str(uuid.uuid4()),
        'Text': text,
        'IsToxic': int(is_toxic),
        'IsAbusive': is_abusive,
        'IsThreat': is_threat,
        'IsProvocative': is_provocative,
        'IsObscene': is_obscene,
        'IsHatespeech': is_hate,
        'IsRacist': is_racist,
        'IsNationalist': is_nationalist,
        'IsSexist': is_sexist,
        'IsHomophobic': is_homophobic,
        'IsReligiousHate': is_religious,
        'IsRadicalism': is_radicalism,
    })

fieldnames = ['CommentId', 'VideoId', 'Text', 'IsToxic', 'IsAbusive', 'IsThreat',
              'IsProvocative', 'IsObscene', 'IsHatespeech', 'IsRacist', 'IsNationalist',
              'IsSexist', 'IsHomophobic', 'IsReligiousHate', 'IsRadicalism']

with open('data/raw/youtoxic_english_1000.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

toxic_count = sum(1 for r in rows if r['IsToxic'] == 1)
print(f'Dataset creado: {len(rows)} filas, {toxic_count} tóxicos ({toxic_count/len(rows)*100:.1f}%), {len(rows)-toxic_count} normales')
print(f'Vocabulario tóxico EN: {len(toxic_en)} frases')
print(f'Vocabulario tóxico ES: {len(toxic_es)} frases')
print(f'Vocabulario normal EN: {len(normal_en)} frases')
print(f'Vocabulario normal ES: {len(normal_es)} frases')
