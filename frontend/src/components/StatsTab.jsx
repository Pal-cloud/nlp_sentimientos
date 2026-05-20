import { motion } from "framer-motion";
import {
  Box, Card, CardContent, Typography, Button, Divider,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircle as CheckCircleIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { TYPE_CONFIG } from "../constants";

const TICK = { fill: "#938F99", fontSize: 12 };
const GRID = { stroke: "rgba(255,255,255,0.05)" };

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const rad = Math.PI / 180;
  const r   = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text x={cx + r * Math.cos(-midAngle * rad)} y={cy + r * Math.sin(-midAngle * rad)}
      fill="#E6E1E5" textAnchor="middle" dominantBaseline="central"
      fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TIP = {
  contentStyle: { background: "#1C1B1F", border: "1px solid rgba(208,188,255,0.15)", borderRadius: 12 },
  itemStyle: { color: "#CAC4D0" },
  labelStyle: { color: "#E6E1E5" },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

export default function StatsTab({ history }) {
  if (!history.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",
                   justifyContent: "center", minHeight: 320, gap: 2 }}>
          <BarChartIcon sx={{ fontSize: 64, color: "rgba(208,188,255,0.2)" }} />
          <Typography variant="h6" color="text.secondary">Sin datos todavía</Typography>
          <Typography variant="body2" color="text.disabled" textAlign="center" maxWidth={300}>
            Analiza al menos un comentario para generar estadísticas en tiempo real.
          </Typography>
        </Box>
      </motion.div>
    );
  }

  const total    = history.length;
  const nToxic   = history.filter(r => r.label === 1).length;
  const nSafe    = total - nToxic;
  const pctToxic = Math.round((nToxic / total) * 100);
  const avgConf  = Math.round(history.reduce((s, r) => s + parseInt(r.confianza), 0) / total);

  const kpis = [
    { val: total,          lbl: "Analizados",        icon: <SearchIcon />,        color: "#D0BCFF" },
    { val: nToxic,         lbl: "Tóxicos",            icon: <WarningAmberIcon />,  color: "#F2B8B5" },
    { val: nSafe,          lbl: "No tóxicos",         icon: <CheckCircleIcon />,   color: "#6DD58C" },
    { val: `${pctToxic}%`, lbl: "Tasa de toxicidad",  icon: <ShowChartIcon />,     color: "#FFB74D" },
    { val: `${avgConf}%`,  lbl: "Confianza media",    icon: <BarChartIcon />,      color: "#4FC3F7" },
  ];

  const pieData = [
    { name: "Tóxico",    value: nToxic, color: "#B3261E" },
    { name: "No tóxico", value: nSafe,  color: "#146C2E" },
  ];

  const typeCounts = {};
  history.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
  const barData = Object.entries(typeCounts).map(([type, count]) => ({
    name: `${TYPE_CONFIG[type]?.icon} ${TYPE_CONFIG[type]?.label ?? type}`,
    count,
    color: TYPE_CONFIG[type]?.color ?? "#888",
  }));

  const lineData = history.map((r, i) => ({
    n: i + 1, conf: parseInt(r.confianza), toxic: r.label,
  }));

  function exportCSV() {
    const rows = [
      ["Métrica","Valor"],
      ["Total analizados", total], ["Tóxicos", nToxic], ["No tóxicos", nSafe],
      ["Tasa toxicidad (%)", pctToxic], ["Confianza media (%)", avgConf],
    ].map(r => r.join(",")).join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "estadisticas_analisis.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

      {/* KPI tiles */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2, mb: 3 }}>
        {kpis.map((k, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.28 }}>
            <Card elevation={0} sx={{
              textAlign: "center", py: 2.5, px: 1,
              border: `1px solid ${k.color}25`,
              background: `${k.color}0d`,
              position: "relative", overflow: "hidden",
            }}>
              <Box sx={{ color: k.color, mb: 0.5 }}>{k.icon}</Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: k.color, lineHeight: 1 }}>
                {k.val}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {k.lbl}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Charts row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>

        {/* Pie */}
        <Card elevation={0}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">🥧 Tóxico vs No tóxico</Typography>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={88}
                  labelLine={false} label={<PieLabel />}>
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip {...TIP} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 1 }}>
              {pieData.map(e => (
                <Box key={e.name} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: e.color }} />
                  <Typography variant="caption" color="text.secondary">
                    {e.name} ({e.value})
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Bar */}
        <Card elevation={0}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">📊 Tipos de toxicidad</Typography>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 10, right: 8, bottom: 28, left: 0 }}>
                <CartesianGrid {...GRID} vertical={false} />
                <XAxis dataKey="name" tick={TICK} interval={0} angle={-14} textAnchor="end" />
                <YAxis tick={TICK} allowDecimals={false} />
                <Tooltip {...TIP} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}
                  label={{ position: "top", fill: "#938F99", fontSize: 12 }}>
                  {barData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Line chart */}
      <Card elevation={0} sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="overline" color="text.secondary">📉 Evolución de confianza</Typography>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={lineData} margin={{ top: 10, right: 24, bottom: 10, left: 0 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="n" tick={TICK}
                label={{ value: "Nº análisis", position: "insideBottom", fill: "#938F99", dy: 12 }} />
              <YAxis tick={TICK} domain={[0, 100]} unit="%" />
              <Tooltip {...TIP} formatter={v => [`${v}%`, "Confianza"]} />
              <ReferenceLine y={50} stroke="#3b3b6b" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="conf" stroke="#D0BCFF" strokeWidth={2.5}
                dot={props => {
                  const c = props.payload.toxic === 1 ? "#F2B8B5" : "#6DD58C";
                  return <circle key={props.key} cx={props.cx} cy={props.cy}
                    r={5} fill={c} stroke="#1C1B1F" strokeWidth={2} />;
                }} />
            </LineChart>
          </ResponsiveContainer>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            {[["#F2B8B5","Tóxico"],["#6DD58C","No tóxico"],["#D0BCFF","Línea confianza"]].map(([c,l]) => (
              <Box key={l} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
                <Typography variant="caption" color="text.secondary">{l}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Export */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" startIcon={<FileDownloadIcon />}
          onClick={exportCSV}
          sx={{ borderRadius: 100, borderColor: "rgba(208,188,255,0.3)" }}>
          Exportar estadísticas CSV
        </Button>
      </Box>
    </motion.div>
  );
}
