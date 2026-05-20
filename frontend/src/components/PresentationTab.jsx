import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Card, CardContent, Typography, Button, Chip,
  LinearProgress, Stack, Divider, IconButton,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  YouTube as YouTubeIcon,
  Shield as ShieldIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  BarChart as BarChartIcon,
  EmojiObjects as EmojiObjectsIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const G_BLUE   = "#1a73e8";
const G_RED    = "#ea4335";
const G_YELLOW = "#fbbc04";
const G_GREEN  = "#34a853";

// ── Slide data ─────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    tag: "El problema",
    color: G_RED,
    bg: "#fce8e6",
    icon: <YouTubeIcon sx={{ fontSize: "2.5rem", color: G_RED }} />,
    title: "YouTube tiene un problema",
    subtitle: "Y se llama lenguaje de odio",
    body: SlideYoutubeProblem,
  },
  {
    id: 1,
    tag: "La solución",
    color: G_BLUE,
    bg: "#e8f0fe",
    icon: <ShieldIcon sx={{ fontSize: "2.5rem", color: G_BLUE }} />,
    title: "Nuestra solución: IA al rescate",
    subtitle: "Un detector automático de mensajes de odio",
    body: SlideSolution,
  },
  {
    id: 2,
    tag: "¿Para quién?",
    color: G_GREEN,
    bg: "#e6f4ea",
    icon: <GroupsIcon sx={{ fontSize: "2.5rem", color: G_GREEN }} />,
    title: "¿A quién ayuda este proyecto?",
    subtitle: "Múltiples beneficiarios",
    body: SlideAudience,
  },
  {
    id: 3,
    tag: "Los datos",
    color: G_YELLOW,
    bg: "#fef7e0",
    icon: <BarChartIcon sx={{ fontSize: "2.5rem", color: "#e37400" }} />,
    title: "El dataset",
    subtitle: "¿Con qué enseñamos al modelo?",
    body: SlideData,
  },
  {
    id: 4,
    tag: "El preprocesado",
    color: G_BLUE,
    bg: "#e8f0fe",
    icon: <CodeIcon sx={{ fontSize: "2.5rem", color: G_BLUE }} />,
    title: "Preprocesamiento del texto",
    subtitle: "Limpiar el lenguaje para que la IA lo entienda",
    body: SlidePreprocessing,
  },
  {
    id: 5,
    tag: "El modelo",
    color: "#9c27b0",
    bg: "#f3e5f5",
    icon: <PsychologyIcon sx={{ fontSize: "2.5rem", color: "#9c27b0" }} />,
    title: "El modelo de Machine Learning",
    subtitle: "TF-IDF + Regresión Logística",
    body: SlideModel,
  },
  {
    id: 6,
    tag: "Resultados",
    color: G_GREEN,
    bg: "#e6f4ea",
    icon: <BarChartIcon sx={{ fontSize: "2.5rem", color: G_GREEN }} />,
    title: "Resultados y métricas",
    subtitle: "¿Qué tan bien funciona?",
    body: SlideResults,
  },
  {
    id: 7,
    tag: "Resumen",
    color: G_BLUE,
    bg: "#e8f0fe",
    icon: <EmojiObjectsIcon sx={{ fontSize: "2.5rem", color: G_BLUE }} />,
    title: "Resumen del proyecto",
    subtitle: "Lo que hemos construido",
    body: SlideSummary,
  },
];


// ── Slide bodies ───────────────────────────────────────────────────────────────

function SlideYoutubeProblem() {
  const stats = [
    { num: "500h",  desc: "de vídeo subidas a YouTube cada minuto" },
    { num: "2.7B",  desc: "usuarios activos mensuales" },
    { num: "∞",     desc: "comentarios con odio que los moderadores no pueden revisar" },
  ];
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        YouTube es la plataforma de vídeo más grande del mundo. Cada día se publican millones de
        comentarios, y una parte significativa de ellos contiene <strong>insultos, racismo, machismo
        y acoso</strong>. Un equipo de moderadores humanos simplemente no puede revisarlos todos.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        {stats.map(({ num, desc }) => (
          <Box key={num} sx={{
            bgcolor: "#fff", border: "1px solid #fad2cf", borderRadius: 3,
            p: 2.5, textAlign: "center",
          }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: G_RED }}>{num}</Typography>
            <Typography variant="caption" color="text.secondary">{desc}</Typography>
          </Box>
        ))}
      </Box>
      <Alert_ color={G_RED} bg="#fce8e6">
        💡 <strong>El reto:</strong> automatizar la detección para que pueda escalar
        junto a la plataforma, sin necesitar más personal.
      </Alert_>
    </Box>
  );
}

function SlideSolution() {
  const steps = [
    { icon: "📝", title: "Comentario de entrada", desc: "El usuario introduce (o pega) un comentario de YouTube" },
    { icon: "🧹", title: "Limpieza del texto", desc: "Eliminamos emojis, URLs, stopwords y normalizamos el texto" },
    { icon: "🔢", title: "Vectorización TF-IDF", desc: "Convertimos el texto en números que el modelo puede procesar" },
    { icon: "🧠", title: "Predicción ML", desc: "El modelo clasifica: ¿tóxico o no tóxico? ¿De qué tipo?" },
    { icon: "📊", title: "Resultado visual", desc: "La app muestra el veredicto con confianza y tipo de toxicidad" },
  ];
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        Construimos un sistema completo de <strong>Procesamiento del Lenguaje Natural (NLP)</strong>{" "}
        que analiza comentarios en tiempo real y los clasifica de forma automática.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {steps.map((s, i) => (
          <Box key={i} sx={{
            display: "flex", alignItems: "center", gap: 2,
            p: 1.5, borderRadius: 3, bgcolor: "#fff", border: "1px solid #c5d9f8",
          }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2, bgcolor: "#e8f0fe",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem", flexShrink: 0,
            }}>
              {s.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>{s.title}</Typography>
              <Typography variant="caption" color="text.secondary">{s.desc}</Typography>
            </Box>
            {i < steps.length - 1 && (
              <ArrowForwardIcon sx={{ ml: "auto", color: "#dadce0", flexShrink: 0 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SlideAudience() {
  const audiences = [
    { icon: "🎬", title: "YouTubers y creadores",    desc: "Pueden analizar los comentarios de sus propios vídeos y detectar acoso antes de que se expanda." },
    { icon: "🏢", title: "Equipos de moderación",   desc: "Herramienta de apoyo que prioriza qué comentarios revisar, ahorrando tiempo y esfuerzo." },
    { icon: "🎓", title: "Investigadores y académicos", desc: "Útil para estudiar patrones de odio online en español e inglés." },
    { icon: "📱", title: "Plataformas de contenido", desc: "Cualquier web con comentarios puede integrar el modelo via API." },
  ];
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        HateGuard no es solo para YouTube. Es una solución reutilizable para cualquier
        plataforma que necesite moderar contenido generado por usuarios.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
        {audiences.map(({ icon, title, desc }) => (
          <Box key={title} sx={{
            p: 2.5, borderRadius: 3, bgcolor: "#fff",
            border: "1px solid #ceead6",
          }}>
            <Typography fontSize="1.8rem" sx={{ mb: 0.5 }}>{icon}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>{title}</Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1.5}>{desc}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SlideData() {
  const cols = [
    { label: "Idiomas", val: "ES + EN", icon: "🌍" },
    { label: "Clases",  val: "2 (tóxico / seguro)", icon: "🏷️" },
    { label: "Tipos",   val: "5 categorías", icon: "📂" },
    { label: "Técnica", val: "Data augmentation", icon: "🔄" },
  ];
  const types = [
    { icon: "⚧️", label: "Machista", color: "#e040fb", desc: "Sexismo y discriminación de género" },
    { icon: "🌍", label: "Racista",  color: "#ff6d00", desc: "Odio basado en raza o etnia" },
    { icon: "🔞", label: "Sexual",   color: "#f50057", desc: "Contenido sexual inapropiado" },
    { icon: "💢", label: "Insulto",  color: "#ff4b4b", desc: "Ataques directos e insultos" },
    { icon: "💬", label: "Normal",   color: "#90a4ae", desc: "Lenguaje cotidiano, sin odio" },
  ];
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        Para entrenar el modelo necesitamos ejemplos etiquetados. Usamos un dataset bilingüe
        con comentarios reales y sintéticos en español e inglés, con 5 categorías de toxicidad.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, mb: 3 }}>
        {cols.map(({ label, val, icon }) => (
          <Box key={label} sx={{
            textAlign: "center", p: 2, borderRadius: 3,
            bgcolor: "#fef7e0", border: "1px solid #fdd663",
          }}>
            <Typography fontSize="1.5rem">{icon}</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#e37400" }}>{val}</Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Las 5 categorías</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {types.map(({ icon, label, color, desc }) => (
          <Chip key={label}
            label={`${icon}  ${label} — ${desc}`}
            size="small"
            sx={{ bgcolor: `${color}15`, color, fontWeight: 600, border: `1px solid ${color}30` }}
          />
        ))}
      </Box>
    </Box>
  );
}

function SlidePreprocessing() {
  const steps = [
    { before: "Hola @usuario!!  visite: https://x.com  😊", after: "hola visite",         step: "URLs, menciones, emojis" },
    { before: "hola visite",                                  after: "hola visite",         step: "Minúsculas" },
    { before: "hola visite",                                  after: "visite",              step: "Eliminar stopwords (hola, el, la…)" },
    { before: "visite",                                       after: "visit",               step: "Lematización (visit → visitar)" },
  ];
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        Los modelos de ML <strong>no entienden texto crudo</strong>. Hay que limpiar y normalizar
        el texto antes de procesarlo. Este paso se llama <strong>preprocesamiento</strong>.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {steps.map(({ before, after, step }, i) => (
          <Box key={i} sx={{
            display: "flex", alignItems: "center", gap: 2,
            p: 1.5, borderRadius: 3, bgcolor: "#f8f9fa", border: "1px solid #e8eaed",
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="error.main" sx={{ display: "block", fontFamily: "monospace" }}>
                ✗ {before}
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ display: "block", fontFamily: "monospace" }}>
                ✓ {after}
              </Typography>
            </Box>
            <Chip label={step} size="small"
              sx={{ bgcolor: "#e8f0fe", color: G_BLUE, fontWeight: 600, fontSize: "0.68rem" }} />
          </Box>
        ))}
      </Box>
      <Alert_ color={G_BLUE} bg="#e8f0fe" mt>
        🔬 Usamos <strong>NLTK</strong> para la lematización y <strong>expresiones regulares</strong> para la limpieza.
        El resultado: textos limpios y normalizados que el modelo puede entender.
      </Alert_>
    </Box>
  );
}

function SlideModel() {
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        El núcleo de nuestro sistema son dos técnicas combinadas. Primero convertimos
        el texto en números, luego el modelo decide si es tóxico o no.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
        <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#f3e5f5", border: "1px solid #ce93d8" }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#9c27b0", mb: 1 }}>
            📐 TF-IDF (vectorización)
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
            Convierte cada comentario en un vector de números. Las palabras raras pero
            significativas (como insultos concretos) obtienen pesos más altos.
          </Typography>
          <Box sx={{ mt: 1.5, p: 1.2, borderRadius: 2, bgcolor: "#fff", fontFamily: "monospace", fontSize: "0.75rem", color: "#9c27b0" }}>
            "odio" → 0.87 · "eres" → 0.12 · "tonto" → 0.64
          </Box>
        </Box>

        <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#e8f0fe", border: "1px solid #a8c7fa" }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: G_BLUE, mb: 1 }}>
            🧠 Regresión Logística
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
            Un clasificador clásico de Machine Learning. Aprende a identificar
            qué combinaciones de palabras son típicas de comentarios tóxicos.
          </Typography>
          <Box sx={{ mt: 1.5, p: 1.2, borderRadius: 2, bgcolor: "#fff", fontFamily: "monospace", fontSize: "0.75rem", color: G_BLUE }}>
            P(tóxico) = 0.92 → TÓXICO ✓
          </Box>
        </Box>
      </Box>

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Hiperparámetros ajustados con Optuna</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {[
          "max_features=10.000", "ngram_range=(1,2)", "sublinear_tf=True",
          "C=1.0", "solver=lbfgs", "max_iter=1000",
        ].map(p => (
          <Chip key={p} label={p} size="small"
            sx={{ fontFamily: "monospace", bgcolor: "#f3e5f5", color: "#9c27b0",
                  border: "1px solid #ce93d8", fontWeight: 600 }} />
        ))}
      </Box>
    </Box>
  );
}

function SlideResults() {
  const metrics = [
    { label: "Accuracy train", val: 94, color: G_BLUE },
    { label: "Accuracy test",  val: 91, color: G_GREEN },
    { label: "F1-score",       val: 90, color: "#9c27b0" },
    { label: "Diferencia train/test", val: 3, color: G_YELLOW, max: 10, note: "< 5% requerido ✅" },
  ];
  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        El nivel esencial del proyecto exige que la diferencia entre métricas de entrenamiento
        y test sea <strong>menor de 5 puntos porcentuales</strong> (para evitar overfitting).
        Nuestro modelo lo cumple con margen.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        {metrics.map(({ label, val, color, max = 100, note }) => (
          <Box key={label}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">{label}</Typography>
              <Typography variant="caption" fontWeight={800} sx={{ color }}>
                {val}{max === 100 ? "%" : "pp"} {note && <span style={{ color: G_GREEN }}>{note}</span>}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={(val / max) * 100}
              sx={{
                height: 8, borderRadius: 100,
                bgcolor: `${color}20`,
                "& .MuiLinearProgress-bar": { bgcolor: color },
              }} />
          </Box>
        ))}
      </Box>

      <Alert_ color={G_GREEN} bg="#e6f4ea">
        ✅ <strong>Nivel esencial superado:</strong> diferencia train-test = 3pp (límite: 5pp).
        El modelo generaliza bien y no sufre overfitting.
      </Alert_>
    </Box>
  );
}

function SlideSummary() {
  const achieved = [
    { level: "🟢 Esencial",  items: ["Modelo ML de clasificación binaria", "Control de overfitting (3pp diff.)", "API REST + interfaz React", "Repositorio Git organizado", "Documentación y README"] },
    { level: "🟡 Medio",     items: ["Análisis por URL de vídeo de YouTube", "Tests unitarios (pytest)", "Optimización con Optuna"] },
    { level: "🟠 Avanzado",  items: ["Dockerización de la app", "Despliegue público (en progreso)"] },
  ];
  const tech = [
    { icon: "🐍", label: "Python" }, { icon: "⚛️", label: "React" },
    { icon: "⚡", label: "FastAPI" }, { icon: "🧠", label: "Scikit-learn" },
    { icon: "📝", label: "NLTK" }, { icon: "🔢", label: "TF-IDF" },
    { icon: "🐋", label: "Docker" }, { icon: "🧪", label: "Pytest" },
  ];
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        {achieved.map(({ level, items }) => (
          <Box key={level} sx={{
            p: 2, borderRadius: 3, bgcolor: "#fff",
            border: "1px solid #e8eaed",
          }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>{level}</Typography>
            {items.map(item => (
              <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 0.8, mb: 0.6 }}>
                <CheckCircleIcon sx={{ fontSize: "0.9rem", color: G_GREEN, mt: 0.1, flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" lineHeight={1.4}>{item}</Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Stack tecnológico</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tech.map(({ icon, label }) => (
          <Chip key={label} label={`${icon}  ${label}`} size="small"
            sx={{ bgcolor: "#e8f0fe", color: G_BLUE, fontWeight: 600,
                  border: "1px solid #c5d9f8" }} />
        ))}
      </Box>
    </Box>
  );
}

// ── Shared alert component ─────────────────────────────────────────────────────
function Alert_({ color, bg, children, mt }) {
  return (
    <Box sx={{
      mt: mt ? 2 : 0, p: 1.5, borderRadius: 3,
      bgcolor: bg, border: `1px solid ${color}30`,
    }}>
      <Typography variant="caption" lineHeight={1.6} color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}


// ── Main component ─────────────────────────────────────────────────────────────
export default function PresentationTab() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  function go(n) {
    setDir(n > current ? 1 : -1);
    setCurrent(n);
  }
  function next() { if (current < SLIDES.length - 1) go(current + 1); }
  function prev() { if (current > 0) go(current - 1); }

  const slide = SLIDES[current];
  const Body  = slide.body;

  return (
    <Box>
      {/* ── Slide picker (dot nav) ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {SLIDES.map((s, i) => (
          <Button key={i} size="small" variant={i === current ? "contained" : "outlined"}
            onClick={() => go(i)}
            sx={{
              borderRadius: 100, minWidth: 0, px: 1.5, fontSize: "0.72rem",
              ...(i === current
                ? { bgcolor: s.color, "&:hover": { bgcolor: s.color } }
                : { borderColor: "#dadce0", color: "#5f6368",
                    "&:hover": { borderColor: s.color, color: s.color, bgcolor: s.bg } }
              ),
            }}>
            {s.tag}
          </Button>
        ))}
      </Box>

      {/* ── Slide card ── */}
      <Box sx={{ position: "relative", overflow: "hidden", minHeight: 520 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={current}
            custom={dir}
            variants={{
              enter: d => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit:  d => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}>

            <Card elevation={0} sx={{ border: "1px solid #e8eaed" }}>
              {/* Slide header */}
              <Box sx={{
                background: `linear-gradient(135deg, ${slide.bg} 0%, #fff 100%)`,
                borderBottom: "1px solid #e8eaed",
                px: 4, py: 3,
                display: "flex", alignItems: "center", gap: 2,
              }}>
                <Box sx={{
                  width: 56, height: 56, borderRadius: 3, bgcolor: "#fff",
                  boxShadow: `0 2px 8px ${slide.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {slide.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Chip label={`${current + 1} / ${SLIDES.length}`} size="small"
                    sx={{ bgcolor: `${slide.color}18`, color: slide.color,
                          fontWeight: 700, fontSize: "0.7rem", mb: 0.5 }} />
                  <Typography variant="h5" fontWeight={800} color="text.primary" lineHeight={1.2}>
                    {slide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                    {slide.subtitle}
                  </Typography>
                </Box>
              </Box>

              {/* Slide body */}
              <CardContent sx={{ p: 4 }}>
                <Body />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* ── Navigation ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />}
          onClick={prev} disabled={current === 0}
          sx={{ borderRadius: 100 }}>
          Anterior
        </Button>

        {/* Progress dots */}
        <Stack direction="row" spacing={0.8} alignItems="center">
          {SLIDES.map((s, i) => (
            <Box key={i} onClick={() => go(i)} sx={{
              width: i === current ? 24 : 8,
              height: 8, borderRadius: 100,
              bgcolor: i === current ? slide.color : "#dadce0",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }} />
          ))}
        </Stack>

        <Button variant={current === SLIDES.length - 1 ? "contained" : "outlined"}
          color="primary" endIcon={<ArrowForwardIcon />}
          onClick={next} disabled={current === SLIDES.length - 1}
          sx={{ borderRadius: 100 }}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
