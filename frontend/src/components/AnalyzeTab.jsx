import { useState } from "react";
import { TYPE_CONFIG, EXAMPLES } from "../constants";

export default function AnalyzeTab({ onAnalyze }) {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [showType, setShowType]       = useState(false);
  const [showCleaned, setShowCleaned] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await onAnalyze(text);
      setResult(data);
      setShowType(false);
      setShowCleaned(false);
    } catch {
      setError("No se pudo conectar con la API. ¿Está corriendo el backend en :8000?");
    } finally {
      setLoading(false);
    }
  }

  function loadExample(type) {
    setText(EXAMPLES[type]);
    setResult(null);
  }

  const cfg = result ? (TYPE_CONFIG[result.toxicity_type] ?? TYPE_CONFIG["lenguaje cotidiano"]) : null;

  return (
    <div className="analyze-grid">
      {/* ── Input ── */}
      <div className="panel">
        <h3>✍️ Introduce un comentario</h3>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe aquí el comentario de YouTube que quieres analizar..."
        />
        <div className="btn-row">
          <button className="btn" onClick={() => loadExample("safe")}>💬 Ejemplo seguro</button>
          <button className="btn" onClick={() => loadExample("toxic")}>⚠️ Ejemplo tóxico</button>
        </div>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
        >
          {loading ? <><span className="spinner" />Analizando...</> : "🔍 Analizar comentario"}
        </button>
        {error && (
          <p style={{color:"#ff4b4b",fontSize:13,marginTop:10}}>{error}</p>
        )}
      </div>

      {/* ── Result ── */}
      <div className="panel">
        <h3>📊 Resultado</h3>

        {!result && !loading && (
          <div className="empty-state">
            <span>🔍</span>
            Introduce un comentario y pulsa Analizar
          </div>
        )}

        {result && (
          <>
            {/* Verdict */}
            <div className={`result-box ${result.toxic ? "toxic" : "safe"}`}>
              <h2>{result.toxic ? "🚨 TÓXICO" : "✅ NO TÓXICO"}</h2>
              <p>
                {result.toxic
                  ? "Este comentario ha sido clasificado como tóxico o con lenguaje de odio."
                  : "Este comentario parece seguro y sin lenguaje ofensivo."}
              </p>
            </div>

            {/* Confidence bar */}
            <div className="conf-block">
              <div className="conf-header">
                <span>Confianza del modelo</span>
                <span style={{color: result.toxic ? "#ff4b4b" : "#00c853", fontWeight:700}}>
                  {result.confidence_pct}%
                </span>
              </div>
              <div className="conf-track">
                <div
                  className="conf-fill"
                  style={{
                    width: `${result.confidence_pct}%`,
                    background: result.toxic ? "#ff4b4b" : "#00c853",
                  }}
                />
              </div>
            </div>

            {/* Type badge */}
            <div
              className="type-badge"
              style={{
                background: `${cfg.color}18`,
                borderColor: cfg.color,
              }}
            >
              <div className="type-label" style={{color: cfg.color}}>
                Tipo de contenido detectado (ML)
              </div>
              <h3 style={{color: cfg.color}}>{cfg.icon} {cfg.label}</h3>
            </div>

            {/* Expandables */}
            <div className="expandable">
              <button className="expand-btn" onClick={() => setShowType(v => !v)}>
                {showType ? "▲" : "▼"} ℹ️ ¿Qué significa cada tipo?
              </button>
              {showType && (
                <div className="expand-content">
                  <table>
                    <tbody>
                      {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                        <tr key={k}>
                          <td style={{color:v.color}}>{v.icon} {v.label}</td>
                          <td>
                            {k === "machista" && "Lenguaje sexista o discriminatorio hacia la mujer"}
                            {k === "racista"  && "Contenido basado en raza, etnia o nacionalidad"}
                            {k === "sexual"   && "Contenido sexual explícito o acoso sexual"}
                            {k === "insulto"  && "Insultos directos, amenazas o lenguaje agresivo"}
                            {k === "lenguaje cotidiano" && "Sin categoría específica clara"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="expandable">
              <button className="expand-btn" onClick={() => setShowCleaned(v => !v)}>
                {showCleaned ? "▲" : "▼"} 🔬 Ver texto preprocesado
              </button>
              {showCleaned && (
                <div className="expand-content">
                  <div className="code-block">
                    {result.cleaned_text || "(texto vacío tras preprocesamiento)"}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
