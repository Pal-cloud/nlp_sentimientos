import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { TYPE_CONFIG, EXAMPLES } from "../constants";

const TYPE_DESCRIPTIONS = {
  machista:            "Lenguaje sexista o discriminatorio hacia la mujer",
  racista:             "Contenido basado en raza, etnia o nacionalidad",
  sexual:              "Contenido sexual explícito o acoso sexual",
  insulto:             "Insultos directos, amenazas o lenguaje agresivo",
  "lenguaje cotidiano":"Sin categoría tóxica específica detectada",
};

export default function AnalyzeTab({ onAnalyze }) {
  const [text, setText]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [showType, setShowType]   = useState(false);
  const [showCode, setShowCode]   = useState(false);

  async function handleSubmit() {
    if (!text.trim()) {
      toast.custom(() => (
        <div style={{
          background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.3)",
          borderRadius:12, padding:"12px 16px", color:"#fbbf24", fontSize:14,
          backdropFilter:"blur(16px)", display:"flex", gap:10, alignItems:"center",
        }}>
          ⚠️ <span>Escribe un comentario antes de analizar.</span>
        </div>
      ), { duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      const data = await onAnalyze(text);
      setResult(data);
      setShowType(false);
      setShowCode(false);
    } catch {
      toast.custom(() => (
        <div style={{
          background:"rgba(248,113,113,0.12)", border:"1px solid rgba(248,113,113,0.3)",
          borderRadius:12, padding:"12px 16px", color:"#f87171", fontSize:14,
          backdropFilter:"blur(16px)", display:"flex", gap:10, alignItems:"center",
        }}>
          🔌 <span>No se pudo conectar con la API.<br/><small style={{opacity:.7}}>¿Está corriendo el backend en :8000?</small></span>
        </div>
      ), { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  function loadExample(type) {
    setText(EXAMPLES[type]);
    setResult(null);
    toast(`Ejemplo ${type === "safe" ? "seguro" : "tóxico"} cargado`, {
      icon: type === "safe" ? "💬" : "⚠️",
      style: { background:"#1a1a2e", color:"#e2e8f0", border:"1px solid #2a2a45", borderRadius:12 },
    });
  }

  const cfg = result ? (TYPE_CONFIG[result.toxicity_type] ?? TYPE_CONFIG["lenguaje cotidiano"]) : null;

  return (
    <div className="analyze-grid">
      {/* ── Input panel ── */}
      <div className="glass panel">
        <div className="panel-title">
          <span>✍️</span> Introduce un comentario
        </div>

        <div className="textarea-wrap">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Pega aquí el comentario de YouTube que quieres analizar…"
            maxLength={1000}
          />
          <span className="char-count">{text.length}/1000</span>
        </div>

        <div className="example-row">
          <button className="btn-example safe" onClick={() => loadExample("safe")}>
            💬 Ejemplo seguro
          </button>
          <button className="btn-example toxic" onClick={() => loadExample("toxic")}>
            ⚠️ Ejemplo tóxico
          </button>
        </div>

        <button
          className="btn-analyze"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
        >
          {loading
            ? <><span className="spinner" />Analizando…</>
            : "🔍 Analizar comentario"}
        </button>

        {/* Tip */}
        <p style={{fontSize:12, color:"var(--muted)", marginTop:14, lineHeight:1.5}}>
          💡 <strong style={{color:"var(--muted2)"}}>Tip:</strong> Funciona en inglés y español.
          El modelo detecta 5 tipos de toxicidad.
        </p>
      </div>

      {/* ── Result panel ── */}
      <div className="glass panel">
        <div className="panel-title">
          <span>📊</span> Resultado del análisis
        </div>

        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="result-empty"
            >
              <div className="empty-icon">🔍</div>
              <p>Introduce un comentario<br/>y pulsa <strong>Analizar</strong></p>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Verdict */}
              <div className={`verdict ${result.toxic ? "toxic" : "safe"}`}>
                <div className="verdict-top">
                  <span className="verdict-icon">{result.toxic ? "🚨" : "✅"}</span>
                  <h2>{result.toxic ? "TÓXICO" : "NO TÓXICO"}</h2>
                </div>
                <p>
                  {result.toxic
                    ? "Este comentario contiene lenguaje tóxico, odio o abuso detectado por el modelo."
                    : "Este comentario parece seguro. No se detectó lenguaje ofensivo."}
                </p>
              </div>

              {/* Confidence bar */}
              <div className="conf-wrap">
                <div className="conf-header">
                  <span>Confianza del modelo</span>
                  <span className="conf-pct" style={{color: result.toxic ? "#f87171" : "#4ade80"}}>
                    {result.confidence_pct}%
                  </span>
                </div>
                <div className="conf-track">
                  <motion.div
                    className="conf-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence_pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ background: result.toxic ? "#f87171" : "#4ade80" }}
                  />
                </div>
              </div>

              {/* Type card */}
              <div
                className="type-card"
                style={{
                  background: `${cfg.color}10`,
                  borderColor: `${cfg.color}35`,
                }}
              >
                <div
                  className="type-icon-wrap"
                  style={{ background: `${cfg.color}20` }}
                >
                  {cfg.icon}
                </div>
                <div>
                  <div className="type-card-label" style={{color: cfg.color}}>
                    Tipo detectado · ML Multiclase
                  </div>
                  <div className="type-card-name" style={{color: cfg.color}}>
                    {cfg.label}
                  </div>
                </div>
              </div>

              {/* Expandables */}
              <div className="expand-item">
                <button
                  className={`expand-trigger${showType ? " open" : ""}`}
                  onClick={() => setShowType(v => !v)}
                >
                  <span>ℹ️ ¿Qué significa cada tipo?</span>
                  <span className="chevron">▾</span>
                </button>
                <AnimatePresence>
                  {showType && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="expand-body">
                        <div className="type-legend">
                          {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                            <div className="legend-row" key={k}>
                              <span className="legend-icon">{v.icon}</span>
                              <span className="legend-name" style={{color: v.color}}>{v.label}</span>
                              <span className="legend-desc">{TYPE_DESCRIPTIONS[k]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="expand-item">
                <button
                  className={`expand-trigger${showCode ? " open" : ""}`}
                  onClick={() => setShowCode(v => !v)}
                >
                  <span>🔬 Ver texto preprocesado</span>
                  <span className="chevron">▾</span>
                </button>
                <AnimatePresence>
                  {showCode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="expand-body">
                        <div className="code-pre">
                          {result.cleaned_text || "(texto vacío tras preprocesamiento)"}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
