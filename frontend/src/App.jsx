import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { analyzeComment } from "./api";
import { TYPE_CONFIG, EXAMPLES } from "./constants";
import AnalyzeTab from "./components/AnalyzeTab";
import HistoryTab from "./components/HistoryTab";
import StatsTab   from "./components/StatsTab";

const TABS = [
  { id: "analyze", label: "🔍 Análisis" },
  { id: "history", label: "📋 Histórico" },
  { id: "stats",   label: "📊 Estadísticas" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [history, setHistory]     = useState([]);

  async function handleAnalyze(text) {
    const data = await analyzeComment(text);
    const cfg  = TYPE_CONFIG[data.toxicity_type] ?? TYPE_CONFIG["lenguaje cotidiano"];

    // Toast notification
    if (data.toxic) {
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            background: "rgba(248,113,113,0.12)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(248,113,113,0.35)", borderRadius: 14,
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
            color: "#f1f5f9", fontSize: 14, maxWidth: 360,
            boxShadow: "0 8px 32px rgba(248,113,113,0.2)",
          }}
        >
          <span style={{fontSize:"1.4rem"}}>🚨</span>
          <div>
            <div style={{fontWeight:700, color:"#f87171"}}>Contenido tóxico detectado</div>
            <div style={{fontSize:12, color:"#94a3b8", marginTop:2}}>
              Tipo: <strong style={{color: cfg.color}}>{cfg.icon} {cfg.label}</strong> · Confianza: <strong>{data.confidence_pct}%</strong>
            </div>
          </div>
        </motion.div>
      ), { duration: 4000 });
    } else {
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            background: "rgba(74,222,128,0.1)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(74,222,128,0.3)", borderRadius: 14,
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
            color: "#f1f5f9", fontSize: 14, maxWidth: 360,
            boxShadow: "0 8px 32px rgba(74,222,128,0.15)",
          }}
        >
          <span style={{fontSize:"1.4rem"}}>✅</span>
          <div>
            <div style={{fontWeight:700, color:"#4ade80"}}>Comentario seguro</div>
            <div style={{fontSize:12, color:"#94a3b8", marginTop:2}}>
              No se detectó lenguaje tóxico · Confianza: <strong>{data.confidence_pct}%</strong>
            </div>
          </div>
        </motion.div>
      ), { duration: 3500 });
    }

    const entry = {
      comment:   text.slice(0, 120) + (text.length > 120 ? "…" : ""),
      resultado: data.toxic ? "🚨 Tóxico" : "✅ No tóxico",
      tipo:      `${cfg.icon} ${cfg.label}`,
      confianza: `${data.confidence_pct}%`,
      label:     data.label,
      type:      data.toxicity_type,
      raw:       data,
    };
    setHistory(prev => [...prev, entry]);
    return data;
  }

  return (
    <div className="app-wrapper">
      <Toaster position="top-right" />

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-ring">🛡️</div>
          <h2>Hate Speech<br/>Detector</h2>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <h4>¿Cómo funciona?</h4>
          <div className="how-steps">
            {[
              "Escribe o pega un comentario de YouTube.",
              "TF-IDF vectoriza el texto al instante.",
              "Logistic Regression lo clasifica.",
              "El modelo ML detecta el tipo exacto.",
            ].map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{i + 1}</div>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <h4>Modelo</h4>
          <div className="model-pills">
            {[
              ["Vectorización",  "TF-IDF 1-2 gramas"],
              ["Clasificador",   "Logistic Regression"],
              ["Tipo",           "ML Multiclase"],
              ["Dataset",        "Bilingüe sintético"],
              ["Backend",        "FastAPI + Python"],
              ["Frontend",       "React + Vite"],
            ].map(([k, v]) => (
              <div className="pill" key={k}>
                <span className="pill-key">{k}</span>
                <span className="pill-val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <h4>Tipos detectados</h4>
          <div className="tag-list">
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <div className="tag-item" key={k}>
                <div className="tag-dot" style={{background: v.color}} />
                <span style={{color: v.color, marginRight: 4}}>{v.icon}</span>
                <span>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          Proyecto académico · NLP · 2025<br/>
          <span style={{color:"#a78bfa"}}>React + FastAPI</span>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="main-content">
        {/* Hero */}
        <div className="hero">
          <div className="hero-badge">✨ ML · NLP · Real-time</div>
          <h1>Detector de Mensajes de Odio<br/><span>en YouTube</span></h1>
          <p>
            Analiza comentarios en tiempo real y detecta lenguaje tóxico usando
            Machine Learning — clasifica el tipo exacto de contenido dañino.
          </p>
          <div className="hero-chips">
            <span className="chip">⚡ Análisis instantáneo</span>
            <span className="chip">🌍 Bilingüe EN / ES</span>
            <span className="chip">🧠 ML Multiclase</span>
            <span className="chip">📊 Estadísticas en vivo</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.id === "history" && history.length > 0 && (
                <span style={{
                  marginLeft: 6, background: "rgba(167,139,250,0.25)",
                  color: "#a78bfa", borderRadius: 100, padding: "1px 7px",
                  fontSize: 11, fontWeight: 700,
                }}>
                  {history.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "analyze" && <AnalyzeTab onAnalyze={handleAnalyze} />}
            {activeTab === "history" && <HistoryTab history={history} onClear={() => { setHistory([]); toast("Histórico limpiado", { icon: "🗑️" }); }} />}
            {activeTab === "stats"   && <StatsTab   history={history} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
