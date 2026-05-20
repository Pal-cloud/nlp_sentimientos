import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { TYPE_CONFIG } from "../constants";

const TICK = { fill: "#64748b", fontSize: 12 };
const GRID = { stroke: "rgba(255,255,255,0.04)" };

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#f1f5f9" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function StatsTab({ history }) {
  if (!history.length) {
    return (
      <motion.div
        className="empty-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="big-icon">📊</div>
        <h3>Sin datos todavía</h3>
        <p>Analiza al menos un comentario para generar estadísticas en tiempo real.</p>
      </motion.div>
    );
  }

  const total    = history.length;
  const nToxic   = history.filter(r => r.label === 1).length;
  const nSafe    = total - nToxic;
  const pctToxic = Math.round((nToxic / total) * 100);
  const avgConf  = Math.round(history.reduce((s, r) => s + parseInt(r.confianza), 0) / total);

  const pieData = [
    { name: "Tóxico",    value: nToxic, color: "#f87171" },
    { name: "No tóxico", value: nSafe,  color: "#4ade80" },
  ];

  const typeCounts = {};
  history.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
  const barData = Object.entries(typeCounts).map(([type, count]) => ({
    name:  `${TYPE_CONFIG[type]?.icon ?? ""} ${TYPE_CONFIG[type]?.label ?? type}`,
    count,
    color: TYPE_CONFIG[type]?.color ?? "#888",
  }));

  const lineData = history.map((r, i) => ({
    n:     i + 1,
    conf:  parseInt(r.confianza),
    toxic: r.label,
  }));

  function exportCSV() {
    const rows = [
      ["Métrica","Valor"],
      ["Total analizados", total],
      ["Tóxicos", nToxic],
      ["No tóxicos", nSafe],
      ["Tasa toxicidad (%)", pctToxic],
      ["Confianza media (%)", avgConf],
    ].map(r => r.join(",")).join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "estadisticas_analisis.csv"; a.click();
    URL.revokeObjectURL(url);
    toast("Estadísticas exportadas correctamente", {
      icon: "⬇️",
      style: { background: "#1a1a2e", color: "#e2e8f0", border: "1px solid #2a2a45", borderRadius: 12 },
    });
  }

  const tiles = [
    { val: total,         lbl: "Analizados",         color: "#a78bfa", icon: "🔍" },
    { val: nToxic,        lbl: "Tóxicos",             color: "#f87171", icon: "🚨" },
    { val: nSafe,         lbl: "No tóxicos",          color: "#4ade80", icon: "✅" },
    { val: `${pctToxic}%`,lbl: "Tasa de toxicidad",   color: "#fbbf24", icon: "📈" },
    { val: `${avgConf}%`, lbl: "Confianza media",      color: "#38bdf8", icon: "🎯" },
  ];

  const tooltipStyle = {
    contentStyle: { background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 },
    itemStyle: { color: "#94a3b8" },
    labelStyle: { color: "#e2e8f0" },
    cursor: { fill: "rgba(255,255,255,0.04)" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* KPI Tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 24 }}>
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            className="glass stat-tile"
            style={{ "--tile-color": t.color }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{t.icon}</div>
            <div className="tile-val" style={{ color: t.color }}>{t.val}</div>
            <div className="tile-lbl">{t.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Pie + Bar row */}
      <div className="charts-row">
        {/* Pie */}
        <div className="glass chart-card">
          <h4>🥧 Tóxico vs No tóxico</h4>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={pieData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={88}
                labelLine={false}
                label={<CustomPieLabel />}
              >
                {pieData.map((e, i) => (
                  <Cell key={i} fill={e.color} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {pieData.map(e => (
              <div key={e.name} className="legend-dot">
                <span style={{ background: e.color }} />
                {e.name} ({e.value})
              </div>
            ))}
          </div>
        </div>

        {/* Bar */}
        <div className="glass chart-card">
          <h4>📊 Tipos de toxicidad</h4>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 28, left: 0 }}>
              <CartesianGrid {...GRID} vertical={false} />
              <XAxis dataKey="name" tick={TICK} interval={0} angle={-14} textAnchor="end" />
              <YAxis tick={TICK} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} label={{ position: "top", fill: "#94a3b8", fontSize: 12 }}>
                {barData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line chart */}
      <div className="glass line-card">
        <h4>📉 Evolución de confianza por análisis</h4>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={lineData} margin={{ top: 10, right: 24, bottom: 10, left: 0 }}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="n" tick={TICK} label={{ value: "Nº análisis", position: "insideBottom", fill: "#64748b", dy: 12 }} />
            <YAxis tick={TICK} domain={[0, 100]} unit="%" />
            <Tooltip {...tooltipStyle} formatter={v => [`${v}%`, "Confianza"]} />
            <ReferenceLine y={50} stroke="#3b3b6b" strokeDasharray="4 4" />
            <Line
              type="monotone" dataKey="conf" stroke="#a78bfa" strokeWidth={2.5}
              dot={props => {
                const c = props.payload.toxic === 1 ? "#f87171" : "#4ade80";
                return <circle key={props.key} cx={props.cx} cy={props.cy} r={5} fill={c} stroke="#05050f" strokeWidth={2} />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-legend" style={{ marginTop: 8 }}>
          <div className="legend-dot"><span style={{ background: "#f87171" }} /> Tóxico</div>
          <div className="legend-dot"><span style={{ background: "#4ade80" }} /> No tóxico</div>
          <div className="legend-dot"><span style={{ background: "#a78bfa" }} /> Línea de confianza</div>
        </div>
      </div>

      {/* Export */}
      <div className="stats-export" style={{ marginTop: 16 }}>
        <button className="btn-ghost-purple" onClick={exportCSV}>⬇️ Exportar estadísticas CSV</button>
      </div>
    </motion.div>
  );
}
