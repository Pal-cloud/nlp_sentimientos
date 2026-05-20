import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function HistoryTab({ history, onClear }) {
  if (!history.length) {
    return (
      <motion.div
        className="empty-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="big-icon">🕐</div>
        <h3>Sin análisis todavía</h3>
        <p>
          Ve a la pestaña <strong>Análisis</strong> y analiza tu primer comentario
          para verlo aquí.
        </p>
      </motion.div>
    );
  }

  function exportCSV() {
    const header = "Nº,Comentario,Resultado,Tipo,Confianza\n";
    const rows = [...history]
      .reverse()
      .map(
        (r, i) =>
          `${i + 1},"${r.comment.replace(/"/g, '""')}","${r.resultado}","${r.tipo}","${r.confianza}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historico_analisis.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV exportado correctamente", {
      icon: "⬇️",
      style: {
        background: "#1a1a2e",
        color: "#e2e8f0",
        border: "1px solid #2a2a45",
        borderRadius: 12,
      },
    });
  }

  const reversed = [...history].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div
        className="history-header glass"
        style={{ padding: "16px 22px", marginBottom: 20 }}
      >
        <h2>
          📋 Histórico de análisis{" "}
          <span
            style={{
              color: "var(--muted)",
              fontWeight: 400,
              fontSize: "0.85rem",
            }}
          >
            ({history.length} entradas)
          </span>
        </h2>
        <div className="history-actions">
          <button
            className="btn-ghost-purple"
            onClick={exportCSV}
          >
            ⬇️ Exportar CSV
          </button>
          <button
            className="btn-ghost-red"
            onClick={onClear}
          >
            🗑️ Limpiar todo
          </button>
        </div>
      </div>

      {/* List */}
      <div className="history-list">
        <AnimatePresence>
          {reversed.map((row, i) => (
            <motion.div
              key={history.length - i}
              className={`hist-card glass ${
                row.label === 1 ? "toxic" : "safe"
              }`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <span className="hist-idx">#{history.length - i}</span>
              <span className="hist-comment">{row.comment}</span>
              <span
                className={`hist-badge ${
                  row.label === 1 ? "toxic" : "safe"
                }`}
              >
                {row.resultado}
              </span>
              <span className="hist-type">{row.tipo}</span>
              <span className="hist-conf">{row.confianza}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
