import { useState } from "react";
import "./App.css";
import { analyzeComment } from "./api";
import { TYPE_CONFIG, EXAMPLES } from "./constants";
import AnalyzeTab from "./components/AnalyzeTab";
import HistoryTab from "./components/HistoryTab";
import StatsTab   from "./components/StatsTab";

const TABS = [
  { id: "analyze", label: "🔍 Análisis Individual" },
  { id: "history", label: "📋 Histórico" },
  { id: "stats",   label: "📊 Estadísticas" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [history, setHistory]     = useState([]);

  async function handleAnalyze(text) {
    const data = await analyzeComment(text);
    const cfg  = TYPE_CONFIG[data.toxicity_type] ?? TYPE_CONFIG["lenguaje cotidiano"];
    setHistory(prev => [...prev, {
      comment:   text.slice(0, 120) + (text.length > 120 ? "…" : ""),
      resultado: data.toxic ? "🚨 Tóxico" : "✅ No tóxico",
      tipo:      `${cfg.icon} ${cfg.label}`,
      confianza: `${data.confidence_pct}%`,
      label:     data.label,
      type:      data.toxicity_type,
      raw:       data,
    }]);
    return data;
  }

  return (
    <div className="app-wrapper">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="emoji">🛡️</span>
          <h2>Hate Speech<br/>Detector</h2>
        </div>

        <div className="sidebar-section">
          <h4>¿Cómo funciona?</h4>
          <ol style={{paddingLeft:18,color:"#94a3b8",fontSize:13,lineHeight:1.8}}>
            <li>Escribe un comentario.</li>
            <li>TF-IDF + Logistic Regression clasifica.</li>
            <li>Clasificador ML detecta el tipo.</li>
          </ol>
        </div>

        <div className="sidebar-section">
          <h4>Modelo</h4>
          <table className="sidebar-table">
            <tbody>
              <tr><td>Vectorización</td><td>TF-IDF 1-2 gramas</td></tr>
              <tr><td>Clasificador</td><td>Logistic Regression</td></tr>
              <tr><td>Tipo</td><td>ML Multiclase</td></tr>
              <tr><td>Dataset</td><td>Bilingüe sintético</td></tr>
            </tbody>
          </table>
        </div>

        <div className="sidebar-section">
          <h4>Etiquetas</h4>
          <table className="sidebar-table">
            <tbody>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                <tr key={k}><td>{v.icon}</td><td style={{color:v.color}}>{v.label}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sidebar-footer">Proyecto académico · NLP · 2025</div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        <div className="header-banner">
          <h1>🛡️ Detector de Mensajes de Odio en YouTube</h1>
          <p>
            Analiza comentarios y detecta lenguaje tóxico usando{" "}
            <strong>Machine Learning</strong> —
            FastAPI + React + TF-IDF + Logistic Regression.
          </p>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "analyze" && (
          <AnalyzeTab onAnalyze={handleAnalyze} />
        )}
        {activeTab === "history" && (
          <HistoryTab history={history} onClear={() => setHistory([])} />
        )}
        {activeTab === "stats" && (
          <StatsTab history={history} />
        )}
      </main>
    </div>
  );
}
