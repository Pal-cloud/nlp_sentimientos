export default function HistoryTab({ history, onClear }) {
  if (!history.length) {
    return (
      <div className="empty-state">
        <span>🕐</span>
        Aún no has analizado ningún comentario. Ve a Análisis Individual para empezar.
      </div>
    );
  }

  function exportCSV() {
    const header = "Comentario,Resultado,Tipo,Confianza\n";
    const rows = history
      .map(r => `"${r.comment}","${r.resultado}","${r.tipo}","${r.confianza}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "historico_analisis.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="history-actions">
        <button className="btn-danger" onClick={onClear}>🗑️ Limpiar histórico</button>
        <button className="btn-export" onClick={exportCSV}>⬇️ Exportar CSV</button>
      </div>

      {[...history].reverse().map((row, i) => (
        <div key={i} className={`hist-row ${row.label === 1 ? "toxic" : "safe"}`}>
          <span className="hist-comment">{row.comment}</span>
          <span className="hist-label">{row.resultado}</span>
          <span className="hist-type">{row.tipo}</span>
          <span className="hist-conf">{row.confianza}</span>
        </div>
      ))}
    </div>
  );
}
