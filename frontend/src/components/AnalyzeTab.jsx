import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  ButtonGroup, LinearProgress, Chip, Alert, AlertTitle,
  Collapse, Divider, Tooltip, IconButton,
} from "@mui/material";
import SearchIcon          from "@mui/icons-material/Search";
import CheckCircleIcon     from "@mui/icons-material/CheckCircle";
import WarningAmberIcon    from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon    from "@mui/icons-material/InfoOutlined";
import CodeIcon            from "@mui/icons-material/Code";
import ExpandMoreIcon      from "@mui/icons-material/ExpandMore";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { TYPE_CONFIG, EXAMPLES } from "../constants";

const TYPE_DESCRIPTIONS = {
  machista:             "Lenguaje sexista o discriminatorio hacia la mujer",
  racista:              "Contenido basado en raza, etnia o nacionalidad",
  sexual:               "Contenido sexual explícito o acoso sexual",
  insulto:              "Insultos directos, amenazas o lenguaje agresivo",
  "lenguaje cotidiano": "Sin categoría tóxica específica detectada",
};

export default function AnalyzeTab({ onAnalyze }) {
  const [text,     setText]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [showType, setShowType] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error,    setError]    = useState(null);

  async function handleSubmit() {
    if (!text.trim()) { setError("Escribe un comentario antes de analizar."); return; }
    setError(null);
    setLoading(true);
    try {
      const data = await onAnalyze(text);
      setResult(data);
      setShowType(false);
      setShowCode(false);
    } catch {
      setError("No se pudo conectar con la API. ¿Está corriendo el backend en :8000?");
    } finally {
      setLoading(false);
    }
  }

  function loadExample(type) {
    setText(EXAMPLES[type]);
    setResult(null);
    setError(null);
  }

  const cfg = result ? (TYPE_CONFIG[result.toxicity_type] ?? TYPE_CONFIG["lenguaje cotidiano"]) : null;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { md: "1.15fr 1fr" }, gap: 3 }}>

      {/* ── Input Card ── */}
      <Card elevation={0}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
            ✍️ Introduce un comentario
          </Typography>

          <TextField
            multiline minRows={7} fullWidth
            variant="outlined"
            placeholder="Pega aquí el comentario de YouTube que quieres analizar…"
            value={text}
            onChange={e => setText(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            sx={{ mt: 1.5, mb: 0.5 }}
            helperText={`${text.length} / 1000 caracteres`}
          />

          {/* Example buttons */}
          <ButtonGroup fullWidth size="small" variant="outlined" sx={{ mb: 2 }}>
            <Button color="success" startIcon={<CheckCircleIcon />}
              onClick={() => loadExample("safe")}
              sx={{ borderRadius: "12px 0 0 12px !important" }}>
              Ejemplo seguro
            </Button>
            <Button color="error" startIcon={<WarningAmberIcon />}
              onClick={() => loadExample("toxic")}
              sx={{ borderRadius: "0 12px 12px 0 !important" }}>
              Ejemplo tóxico
            </Button>
          </ButtonGroup>

          {/* Inline error alert */}
          <Collapse in={!!error}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </Collapse>

          <Button
            variant="contained" color="primary" fullWidth size="large"
            startIcon={loading ? undefined : <SearchIcon />}
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            sx={{ py: 1.4, fontSize: "1rem" }}>
            {loading ? "Analizando…" : "Analizar comentario"}
          </Button>
          {loading && <LinearProgress sx={{ mt: 1, borderRadius: 100 }} />}

          {/* Tip */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 2,
                     p: 1.5, borderRadius: 3, bgcolor: "rgba(103,80,164,0.1)",
                     border: "1px solid rgba(208,188,255,0.12)" }}>
            <LightbulbOutlinedIcon sx={{ fontSize: "1.1rem", color: "primary.light", mt: 0.1 }} />
            <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
              <strong style={{ color: "#CAC4D0" }}>Tip:</strong> Funciona en inglés y español.
              El modelo detecta 5 tipos de toxicidad distintos.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ── Result Card ── */}
      <Card elevation={0}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
            📊 Resultado del análisis
          </Typography>

          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",
                           justifyContent: "center", minHeight: 260, gap: 2, color: "text.secondary" }}>
                  <Box sx={{ width: 72, height: 72, borderRadius: "50%",
                             bgcolor: "rgba(103,80,164,0.12)", border: "1px solid rgba(208,188,255,0.15)",
                             display: "flex", alignItems: "center", justifyContent: "center",
                             fontSize: "2rem" }}>
                    🔍
                  </Box>
                  <Typography variant="body2" textAlign="center" color="text.secondary">
                    Introduce un comentario<br />y pulsa <strong>Analizar</strong>
                  </Typography>
                </Box>
              </motion.div>
            )}

            {result && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}>

                {/* Verdict alert */}
                <Alert
                  severity={result.toxic ? "error" : "success"}
                  variant="outlined"
                  icon={result.toxic ? <WarningAmberIcon /> : <CheckCircleIcon />}
                  sx={{ mb: 2, borderRadius: 3, alignItems: "flex-start" }}>
                  <AlertTitle sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                    {result.toxic ? "CONTENIDO TÓXICO" : "COMENTARIO SEGURO"}
                  </AlertTitle>
                  <Typography variant="body2">
                    {result.toxic
                      ? "Este comentario contiene lenguaje tóxico, odio o abuso detectado por el modelo."
                      : "Este comentario parece seguro. No se detectó lenguaje ofensivo."}
                  </Typography>
                </Alert>

                {/* Confidence bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                    <Typography variant="caption" color="text.secondary">Confianza del modelo</Typography>
                    <Typography variant="caption" fontWeight={700}
                      sx={{ color: result.toxic ? "error.main" : "success.main" }}>
                      {result.confidence_pct}%
                    </Typography>
                  </Box>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    style={{ transformOrigin: "left", borderRadius: 100 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}>
                    <LinearProgress variant="determinate" value={result.confidence_pct}
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          background: result.toxic
                            ? "linear-gradient(90deg, #B3261E, #F2B8B5)"
                            : "linear-gradient(90deg, #146C2E, #6DD58C)",
                        },
                      }} />
                  </motion.div>
                </Box>

                {/* Type chip */}
                <Box sx={{ mb: 2, p: 1.8, borderRadius: 3,
                           bgcolor: `${cfg.color}14`, border: `1px solid ${cfg.color}40`,
                           display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5,
                             bgcolor: `${cfg.color}22`,
                             display: "flex", alignItems: "center", justifyContent: "center",
                             fontSize: "1.4rem", flexShrink: 0 }}>
                    {cfg.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: cfg.color,
                      textTransform: "uppercase", letterSpacing: 1.5 }}>
                      Tipo detectado · ML Multiclase
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: cfg.color }}>
                      {cfg.label}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(208,188,255,0.1)", mb: 1.5 }} />

                {/* Expandables */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Types legend */}
                  <Box>
                    <Button fullWidth variant="outlined" size="small" color="secondary"
                      startIcon={<InfoOutlinedIcon />}
                      endIcon={<ExpandMoreIcon sx={{
                        transform: showType ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s" }} />}
                      onClick={() => setShowType(v => !v)}
                      sx={{ justifyContent: "space-between", borderRadius: 2.5, px: 1.5,
                            borderColor: "rgba(208,188,255,0.2)", color: "text.secondary" }}>
                      ¿Qué significa cada tipo?
                    </Button>
                    <Collapse in={showType}>
                      <Box sx={{ mt: 1, p: 1.5, borderRadius: 3,
                                 bgcolor: "rgba(28,27,31,0.8)", border: "1px solid rgba(208,188,255,0.1)" }}>
                        {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                          <Box key={k} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.7 }}>
                            <Typography fontSize="1.1rem">{v.icon}</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: v.color, minWidth: 100 }}>
                              {v.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {TYPE_DESCRIPTIONS[k]}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  {/* Raw text */}
                  <Box>
                    <Button fullWidth variant="outlined" size="small" color="secondary"
                      startIcon={<CodeIcon />}
                      endIcon={<ExpandMoreIcon sx={{
                        transform: showCode ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s" }} />}
                      onClick={() => setShowCode(v => !v)}
                      sx={{ justifyContent: "space-between", borderRadius: 2.5, px: 1.5,
                            borderColor: "rgba(208,188,255,0.2)", color: "text.secondary" }}>
                      Ver texto preprocesado
                    </Button>
                    <Collapse in={showCode}>
                      <Box sx={{ mt: 1, p: 1.5, borderRadius: 3,
                                 bgcolor: "#0d1117", border: "1px solid rgba(208,188,255,0.1)",
                                 fontFamily: "'Courier New', monospace", fontSize: "0.8rem",
                                 color: "#D0BCFF", wordBreak: "break-all", lineHeight: 1.6 }}>
                        {result.cleaned_text || "(texto vacío tras preprocesamiento)"}
                      </Box>
                    </Collapse>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
}
