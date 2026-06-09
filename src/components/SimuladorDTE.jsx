import React, { useState } from "react";
import {
  Box, Typography, Paper, Button, MenuItem, Select, FormControl,
  InputLabel, Chip, Divider, Stack, Stepper, Step, StepLabel,
  StepContent, Alert, IconButton, Tooltip,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  AccountTree as AccountTreeIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import {
  DTE_TRAMITE, DTE_IMPORTADO, ESTADO_LABELS, ESTADO_INICIAL,
} from "../data/mockData";

// ─── Colores por estado ──────────────────────────────────────────────────────
const COLORES_ESTADO = {
  EnProcesoHabilitacion: { bg: "#e3f2fd", border: "#1565c0", text: "#0d47a1", dot: "#1565c0" },
  Importado:             { bg: "#fff8e1", border: "#f9a825", text: "#e65100", dot: "#f9a825" },
  TramiteEnCurso:        { bg: "#ede7f6", border: "#6a1b9a", text: "#4a148c", dot: "#6a1b9a" },
  Habilitado:            { bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20", dot: "#2e7d32" },
  EnProcesoRectificacion:{ bg: "#fff3e0", border: "#e65100", text: "#bf360c", dot: "#e65100" },
  EnProcesoModificacion: { bg: "#fce4ec", border: "#c62828", text: "#880e4f", dot: "#c62828" },
  EnProcesoRenovacion:   { bg: "#e0f7fa", border: "#006064", text: "#004d40", dot: "#006064" },
  ProximoAVencer:        { bg: "#fff8e1", border: "#f57f17", text: "#e65100", dot: "#f57f17" },
  Vencido:               { bg: "#ffebee", border: "#d32f2f", text: "#b71c1c", dot: "#d32f2f" },
  Inhabilitado:          { bg: "#fafafa", border: "#616161", text: "#212121", dot: "#616161" },
  BAJA:                  { bg: "#212121", border: "#000000", text: "#ffffff", dot: "#000000" },
};

const getColor = (estado) => COLORES_ESTADO[estado] || { bg: "#f5f5f5", border: "#bbb", text: "#333", dot: "#bbb" };

const EstadoChip = ({ estado, size = "medium" }) => {
  const c = getColor(estado);
  return (
    <Chip
      label={ESTADO_LABELS[estado] || estado}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: size === "large" ? "1rem" : "0.78rem",
        px: size === "large" ? 2 : 0,
        py: size === "large" ? 0.5 : 0,
        bgcolor: c.bg,
        color: c.text,
        border: `2px solid ${c.border}`,
        borderRadius: "8px",
        height: size === "large" ? 44 : undefined,
        "& .MuiChip-label": { px: size === "large" ? 2 : 1.5 },
      }}
    />
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const SimuladorDTE = () => {
  const [origen, setOrigen] = useState("TRÁMITE");
  const [estadoActual, setEstadoActual] = useState(ESTADO_INICIAL["TRÁMITE"]);
  const [recorrido, setRecorrido] = useState([]);

  const dte = origen === "TRÁMITE" ? DTE_TRAMITE : DTE_IMPORTADO;
  const transicionesDisponibles = dte[estadoActual] || [];

  const handleOrigen = (e) => {
    const val = e.target.value;
    setOrigen(val);
    const estadoInicial = ESTADO_INICIAL[val];
    setEstadoActual(estadoInicial);
    setRecorrido([]);
  };

  const handleTransicion = (transicion) => {
    setRecorrido((prev) => [
      ...prev,
      { from: estadoActual, to: transicion.hacia, label: transicion.label },
    ]);
    setEstadoActual(transicion.hacia);
  };

  const handleReset = () => {
    const estadoInicial = ESTADO_INICIAL[origen];
    setEstadoActual(estadoInicial);
    setRecorrido([]);
  };

  const colorActual = getColor(estadoActual);
  const esFinal = transicionesDisponibles.length === 0;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 0 }}>
      {/* ── Encabezado ────────────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <Box sx={{ bgcolor: "#005596", p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <AccountTreeIcon sx={{ color: "white", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 900, letterSpacing: -0.5 }}>
              Simulador de DTE
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
              Diagrama de Transición de Estados — seleccioná un origen y recorré el ciclo de vida del establecimiento
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Origen del establecimiento</InputLabel>
            <Select value={origen} label="Origen del establecimiento" onChange={handleOrigen}>
              <MenuItem value="TRÁMITE">📄 Origen: Trámite</MenuItem>
              <MenuItem value="IMPORTADO">📥 Origen: Importado</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Reiniciar simulador" arrow>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{ textTransform: "none", borderRadius: "8px", borderColor: "#cbd5e1", color: "#64748b" }}
            >
              Reiniciar
            </Button>
          </Tooltip>

          {recorrido.length > 0 && (
            <Chip label={`${recorrido.length} transición${recorrido.length > 1 ? "es" : ""} realizadas`} size="small"
              sx={{ bgcolor: "#e8f4fd", color: "#005596", fontWeight: 700, border: "1px solid #b3d9f5" }} />
          )}
        </Box>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        {/* ── Panel izquierdo: Estado actual + transiciones ─────────────────── */}
        <Box>
          {/* Estado actual */}
          <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: `2px solid ${colorActual.border}`, bgcolor: colorActual.bg }}>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="overline" sx={{ color: colorActual.text, fontWeight: 700, opacity: 0.7 }}>
                ESTADO ACTUAL
              </Typography>
              <Box sx={{ my: 2 }}>
                <EstadoChip estado={estadoActual} size="large" />
              </Box>
              {esFinal && (
                <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 1, fontSize: "0.8rem", borderRadius: "8px" }}>
                  Estado final del DTE. No existen más transiciones posibles.
                </Alert>
              )}
            </Box>
          </Paper>

          {/* Transiciones disponibles */}
          {!esFinal && (
            <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Transiciones disponibles
                </Typography>
              </Box>
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {transicionesDisponibles.map((t) => {
                  const cDest = getColor(t.hacia);
                  return (
                    <Paper
                      key={t.hacia}
                      variant="outlined"
                      onClick={() => handleTransicion(t)}
                      sx={{
                        p: 2, cursor: "pointer", borderRadius: "10px",
                        border: `1.5px solid ${cDest.border}`,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: cDest.bg,
                          transform: "translateX(4px)",
                          boxShadow: `0 4px 12px ${cDest.border}30`,
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <ArrowForwardIcon sx={{ color: cDest.border, fontSize: 18, flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: cDest.text }}>
                            → {ESTADO_LABELS[t.hacia] || t.hacia}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {t.label}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
          )}
        </Box>

        {/* ── Panel derecho: Recorrido realizado ───────────────────────────── */}
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", height: "fit-content" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Recorrido del simulador
            </Typography>
            {recorrido.length > 0 && (
              <Chip label={`${recorrido.length + 1} estados`} size="small" sx={{ bgcolor: "#f1f5f9", fontWeight: 600 }} />
            )}
          </Box>
          <Box sx={{ p: 2 }}>
            {recorrido.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <AccountTreeIcon sx={{ fontSize: 48, color: "#e2e8f0", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Seleccioná una transición para ver el recorrido
                </Typography>
              </Box>
            ) : (
              <Stepper orientation="vertical" nonLinear>
                {/* Estado inicial */}
                <Step active completed>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: getColor(recorrido[0].from).border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ color: "white", fontSize: "0.65rem", fontWeight: 800 }}>0</Typography>
                      </Box>
                    )}
                  >
                    <EstadoChip estado={recorrido[0].from} size="small" />
                  </StepLabel>
                  <StepContent>
                    <Typography variant="caption" color="text.secondary">Estado inicial</Typography>
                  </StepContent>
                </Step>

                {recorrido.map((paso, idx) => {
                  const cPaso = getColor(paso.to);
                  return (
                    <Step key={idx} active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: cPaso.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ color: "white", fontSize: "0.65rem", fontWeight: 800 }}>{idx + 1}</Typography>
                          </Box>
                        )}
                      >
                        <EstadoChip estado={paso.to} size="small" />
                      </StepLabel>
                      <StepContent>
                        <Typography variant="caption" color="text.secondary">{paso.label}</Typography>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            )}

            {esFinal && recorrido.length > 0 && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2, borderRadius: "8px", fontSize: "0.8rem" }}>
                El establecimiento alcanzó un estado final del DTE.
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SimuladorDTE;
