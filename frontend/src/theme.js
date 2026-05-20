import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary:   { main: "#6750A4", light: "#D0BCFF", dark: "#381E72" },
    secondary: { main: "#625B71", light: "#CCC2DC" },
    error:     { main: "#F2B8B5", dark: "#B3261E" },
    success:   { main: "#6DD58C", dark: "#146C2E" },
    warning:   { main: "#FFB74D" },
    background: { default: "#10101a", paper: "#1C1B1F" },
    surface:   { main: "#2B2930" },
    text:      { primary: "#E6E1E5", secondary: "#CAC4D0" },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle2: { color: "#CAC4D0" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #10101a 0%, #1a1226 50%, #0d1117 100%)",
          minHeight: "100vh",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1C1B1F",
          border: "1px solid rgba(208,188,255,0.12)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: 0.3,
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6750A4, #4f46e5)",
          boxShadow: "0 4px 20px rgba(103,80,164,0.35)",
          "&:hover": { boxShadow: "0 6px 28px rgba(103,80,164,0.5)" },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.9rem",
          color: "#CAC4D0",
          "&.Mui-selected": { color: "#D0BCFF" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#D0BCFF", height: 3, borderRadius: 3 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "& fieldset": { borderColor: "rgba(208,188,255,0.2)" },
            "&:hover fieldset": { borderColor: "rgba(208,188,255,0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#D0BCFF" },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 100, height: 10, backgroundColor: "rgba(255,255,255,0.06)" },
        bar:  { borderRadius: 100 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontWeight: 500 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1C1B1F",
          borderRight: "1px solid rgba(208,188,255,0.1)",
          width: 260,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontSize: "0.85rem" },
        secondary: { fontSize: "0.75rem", color: "#938F99" },
      },
    },
  },
});

export default theme;
