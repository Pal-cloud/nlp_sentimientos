import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Scatter, ReferenceLine,
} from "recharts";
import { TYPE_CONFIG } from "../constants";

export default function StatsTab({ history }) {
  if (!history.length) {
    return (
      <div className="empty-state">
        <span>📊</span>
        Analiza al menos un comentario para ver las estadísticas.
      </div>
    );
  }

  const total    = history.length;
  const nToxic   = history.filter(r => r.label === 1).length;
  const nSafe    = total - nToxic;
  const pctToxic = Math.round((nToxic / total) * 100);

  // Pie data
  const pieData = [
    { name: "Tóxico",    value: nToxic, color: "#ff4b4b" },
    { name: "No tóxico", value: nSafe,  color: "#00c853" },
  ];

  // Bar data — types
  const typeCounts = {};
  history.forEach(r => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });
  const barData = Object.entries(typeCounts).map(([type, count]) => ({
    name:  `${TYPE_CONFIG[type]?.icon ?? ""} ${TYPE_CONFIG[type]?.label ?? type}`,
    count,
    color: TYPE_CONFIG[type]?.color ?? "#888",
  }));

  // Line data — confidence over time
  const lineData = history.map((r, i) => ({
    n:    i + 1,
    conf: parseInt(r.confianza),
    toxic: r.label,
  }));

  function exportCSV() {
    const rows = [
      ["Métrica","Valor"],
      ["Total analizados", total],
      ["Tóxicos", nToxic],
      ["No tóxicos", nSafe],
      ["Tasa toxicidad (%)", pctToxic],
    ].map(r => r.join(",")).join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "estadisticas_analisis.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const TICK = { fill: "#64748b", fontSize: 12 };
  const GRID = { stroke: "#1e1e35" };

  return (
    <div>
      {/* Tiles */}
      <div className="stats-tiles">
        {[
          { val: total,       lbl: "Analizados",        color: "#a78bfa" },
          { val: nToxic,      lbl: "Tóxicos 🚨",        color: "#ff4b4b" },
          { val: nSafe,       lbl: "No tóxicos ✅",      color: "#00c853" },
          { val: `${pctToxic}%`, lbl: "Tasa de toxicidad", color: "#fbbf24" },
        ].map((t, i) => (
          <div className="tile" key={i}>
            <div className="tile-val" style={{color: t.color}}>{t.val}</div>
            <div className="tile-lbl">{t.lbl}</div>
          </div>
        ))}
      </div>

      {/* Pie + Bar */}
      <div className="charts-grid">
        <div className="chart-panel">
          <h4>🥧 Tóxico vs No tóxico</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name"
                   cx="50%" cy="50%" outerRadius={80}
                   label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}
                   labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{background:"#1a1a2e",border:"1px solid #2a2a45",borderRadius:8}}
                labelStyle={{color:"#e2e8f0"}}
                itemStyle={{color:"#94a3b8"}}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-panel">
          <h4>📊 Tipos de toxicidad</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{top:10,right:10,bottom:20,left:0}}>
              <CartesianGrid {...GRID} vertical={false} />
              <XAxis dataKey="name" tick={TICK} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={TICK} allowDecimals={false} />
              <Tooltip
                contentStyle={{background:"#1a1a2e",border:"1px solid #2a2a45",borderRadius:8}}
                itemStyle={{color:"#94a3b8"}}
                cursor={{fill:"#ffffff08"}}
              />
              <Bar dataKey="count" radius={[6,6,0,0]} label={{position:"top",fill:"#e2e8f0",fontSize:12}}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line chart */}
      <div className="line-chart-panel">
        <h4>📉 Evolución de confianza por análisis</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData} margin={{top:10,right:20,bottom:5,left:0}}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="n" tick={TICK} label={{value:"Nº análisis",position:"insideBottom",fill:"#64748b",dy:10}} />
            <YAxis tick={TICK} domain={[0,100]} unit="%" />
            <Tooltip
              contentStyle={{background:"#1a1a2e",border:"1px solid #2a2a45",borderRadius:8}}
              itemStyle={{color:"#94a3b8"}}
              formatter={v => [`${v}%`, "Confianza"]}
            />
            <ReferenceLine y={50} stroke="#3b3b6b" strokeDasharray="4 4" />
            <Line
              type="monotone" dataKey="conf" stroke="#a78bfa" strokeWidth={2}
              dot={props => {
                const color = props.payload.toxic === 1 ? "#ff4b4b" : "#00c853";
                return <circle key={props.key} cx={props.cx} cy={props.cy} r={5} fill={color} stroke="#0a0a14" strokeWidth={1.5}/>;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:16,marginTop:8,fontSize:13,color:"#64748b"}}>
          <span><span style={{color:"#ff4b4b"}}>●</span> Tóxico</span>
          <span><span style={{color:"#00c853"}}>●</span> No tóxico</span>
        </div>
      </div>

      <button className="btn-export" onClick={exportCSV}>⬇️ Exportar estadísticas CSV</button>
    </div>
  );
}
