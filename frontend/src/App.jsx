import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Drawer, AppBar, Toolbar, Tabs, Tab, Typography,
  Chip, List, ListItem, ListItemIcon, ListItemText,
  Divider, Avatar, Snackbar, Alert,
} from "@mui/material";
import ShieldIcon        from "@mui/icons-material/Shield";
import SearchIcon        from "@mui/icons-material/Search";
import HistoryIcon       from "@mui/icons-material/History";
import BarChartIcon      from "@mui/icons-material/BarChart";
import HelpOutlineIcon   from "@mui/icons-material/HelpOutline";
import LooksOneIcon      from "@mui/icons-material/LooksOne";
import LooksTwoIcon      from "@mui/icons-material/LooksTwo";
import Looks3Icon        from "@mui/icons-material/Looks3";
import Looks4Icon        from "@mui/icons-material/Looks4";
import SmartToyIcon      from "@mui/icons-material/SmartToy";
import { analyzeComment }    from "./api";
import { TYPE_CONFIG, EXAMPLES } from "./constants";
import AnalyzeTab  from "./components/AnalyzeTab";
import HistoryTab  from "./components/HistoryTab";
import StatsTab    from "./components/StatsTab";

const DRAWER_W = 260;

const HOW_STEPS = [
  { icon: <LooksOneIcon fontSize="small" />, text: "Escribe o pega un comentario de YouTube." },
  { icon: <LooksTwoIcon fontSize="small" />, text: "TF-IDF vectoriza el texto al instante." },
  { icon: <Looks3Icon   fontSize="small" />, text: "Logistic Regression lo clasifica." },
  { icon: <Looks4Icon   fontSize="small" />, text: "El modelo ML detecta el tipo exacto." },
];

export default function App() {
  const [tab,     setTab]     = useState(0);
  const [history, setHistory] = useState([]);
  const [snack,   setSnack]   = useState(null); // { msg, severity }

  async function handleAnalyze(text) {
    const data = await analyzeComment(text);
    const cfg  = TYPE_CONFIG[data.toxicity_type] ?? TYPE_CONFIG["lenguaje cotidiano"];

    if (data.toxic) {
      setSnack({ severity: "error",
        msg: `🚨 Tóxico detectado — ${cfg.icon} ${cfg.label} · ${data.confidence_pct}% confianza` });
    } else {
      setSnack({ severity: "success",
        msg: `✅ Comentario seguro — confianza ${data.confidence_pct}%` });
    }

    setHistory(prev => [...prev, {
      comment:   text.slice(0, 120) + (text.length > 120 ? "…" : ""),
      resultado: data.toxic ? "Tóxico" : "No tóxico",
      tipo:      `${cfg.icon} ${cfg.label}`,
      confianza: `${data.confidence_pct}%`,
      label:     data.label,
      type:      data.toxicity_type,
      raw:       data,
    }]);
    return data;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Permanent Drawer ── */}
      <Drawer variant="permanent" anchor="left"
        sx={{ width: DRAWER_W, flexShrink: 0,
              "& .MuiDrawer-paper": { width: DRAWER_W, overflowX: "hidden" } }}>

        {/* Logo */}
        <Box sx={{ px: 2.5, py: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44,
                        boxShadow: "0 0 20px rgba(103,80,164,0.5)" }}>
            <ShieldIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
              Hate Speech
            </Typography>
            <Typography variant="caption" color="text.secondary">Detector · NLP</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(208,188,255,0.1)" }} />

        {/* How it works */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", px: 0.5 }}>
            ¿Cómo funciona?
          </Typography>
          <List dense disablePadding>
            {HOW_STEPS.map((s, i) => (
              <ListItem key={i} sx={{ px: 0.5, py: 0.6 }}>
                <ListItemIcon sx={{ minWidth: 32, color: "primary.light" }}>{s.icon}</ListItemIcon>
                <ListItemText primary={s.text} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ borderColor: "rgba(208,188,255,0.1)", my: 1.5 }} />

        {/* Tech stack */}
        <Box sx={{ px: 2 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", px: 0.5 }}>
            Tecnología
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1, px: 0.5 }}>
            {["TF-IDF","Logistic Reg.","ML Multiclase","FastAPI","React + Vite","Bilingüe ES/EN"]
              .map(t => (
                <Chip key={t} label={t} size="small"
                  sx={{ bgcolor: "rgba(103,80,164,0.18)", color: "primary.light",
                        border: "1px solid rgba(208,188,255,0.15)", fontSize: "0.7rem" }} />
              ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(208,188,255,0.1)", my: 1.5 }} />

        {/* Type legend */}
        <Box sx={{ px: 2 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", px: 0.5 }}>
            Tipos detectados
          </Typography>
          <List dense disablePadding sx={{ mt: 0.5 }}>
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <ListItem key={k} sx={{ px: 0.5, py: 0.4 }}>
                <ListItemIcon sx={{ minWidth: 28, fontSize: "1rem" }}>{v.icon}</ListItemIcon>
                <ListItemText primary={v.label}
                  primaryTypographyProps={{ fontSize: "0.8rem", color: v.color, fontWeight: 600 }} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: "auto", px: 2.5, py: 2, borderTop: "1px solid rgba(208,188,255,0.08)" }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Proyecto académico · NLP · 2025
          </Typography>
          <Typography variant="caption" color="primary.light">React + FastAPI</Typography>
        </Box>
      </Drawer>

      {/* ── Main ── */}
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

        {/* AppBar */}
        <AppBar position="static" elevation={0}
          sx={{ bgcolor: "rgba(28,27,31,0.9)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(208,188,255,0.1)" }}>
          <Toolbar sx={{ gap: 2 }}>
            <SmartToyIcon sx={{ color: "primary.light" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.primary" lineHeight={1}>
                Detector de Mensajes de Odio en YouTube
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Análisis en tiempo real · ML Multiclase
              </Typography>
            </Box>
            <Chip label={`${history.length} analizados`} size="small"
              icon={<BarChartIcon sx={{ fontSize: "1rem !important" }} />}
              sx={{ bgcolor: "rgba(103,80,164,0.2)", color: "primary.light",
                    border: "1px solid rgba(208,188,255,0.2)" }} />
          </Toolbar>

          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            sx={{ px: 2, minHeight: 44 }}
            TabIndicatorProps={{ style: { height: 3, borderRadius: 3 } }}>
            <Tab icon={<SearchIcon fontSize="small" />} iconPosition="start" label="Análisis" />
            <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  Histórico
                  {history.length > 0 && (
                    <Chip label={history.length} size="small"
                      sx={{ height: 18, fontSize: "0.65rem", bgcolor: "rgba(208,188,255,0.2)",
                            color: "primary.light", ".MuiChip-label": { px: 0.8 } }} />
                  )}
                </Box>
              } />
            <Tab icon={<BarChartIcon fontSize="small" />} iconPosition="start" label="Estadísticas" />
          </Tabs>
        </AppBar>

        {/* Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}>
              {tab === 0 && <AnalyzeTab onAnalyze={handleAnalyze} />}
              {tab === 1 && (
                <HistoryTab history={history}
                  onClear={() => { setHistory([]); setSnack({ severity: "info", msg: "Histórico limpiado" }); }} />
              )}
              {tab === 2 && <StatsTab history={history} />}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Global Snackbar */}
      <Snackbar open={!!snack} autoHideDuration={4500}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnack(null)} severity={snack?.severity ?? "info"}
          variant="filled" sx={{ minWidth: 300, borderRadius: 3 }}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
