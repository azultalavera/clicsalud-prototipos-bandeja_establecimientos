import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Chip, Button, Stack,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  PersonOutlined as PersonIcon,
  AutoMode as AutoIcon,
} from "@mui/icons-material";
import { MOCK_ESTABLECIMIENTOS, MOCK_HISTORIAL, ESTADO_LABELS } from "../data/mockData";

// ─── Colores por estado ──────────────────────────────────────────────────────
const COLORES_ESTADO = {
  EnProcesoHabilitacion: { bg: "#e3f2fd", border: "#1565c0", text: "#0d47a1" },
  Importado:             { bg: "#fff8e1", border: "#f9a825", text: "#e65100" },
  TramiteEnCurso:        { bg: "#ede7f6", border: "#6a1b9a", text: "#4a148c" },
  Habilitado:            { bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20" },
  EnProcesoRectificacion:{ bg: "#fff3e0", border: "#e65100", text: "#bf360c" },
  EnProcesoModificacion: { bg: "#fce4ec", border: "#c62828", text: "#880e4f" },
  EnProcesoRenovacion:   { bg: "#e0f7fa", border: "#006064", text: "#004d40" },
  ProximoAVencer:        { bg: "#fff8e1", border: "#f57f17", text: "#e65100" },
  Vencido:               { bg: "#ffebee", border: "#d32f2f", text: "#b71c1c" },
  Inhabilitado:          { bg: "#fafafa", border: "#616161", text: "#212121" },
  BAJA:                  { bg: "#212121", border: "#000000", text: "#ffffff" },
};

const getColor = (estado) => COLORES_ESTADO[estado] || { bg: "#f5f5f5", border: "#bbb", text: "#333" };

const EstadoChip = ({ estado }) => {
  if (!estado) return <Chip label="—" size="small" sx={{ borderRadius: "6px" }} />;
  const c = getColor(estado);
  return (
    <Chip
      label={ESTADO_LABELS[estado] || estado}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: "0.75rem",
        bgcolor: c.bg,
        color: c.text,
        border: `1.5px solid ${c.border}`,
        borderRadius: "6px",
      }}
    />
  );
};

// ─── Línea de tiempo ─────────────────────────────────────────────────────────
const TimelineDot = ({ estado }) => {
  const c = getColor(estado);
  return (
    <Box sx={{
      width: 16, height: 16, borderRadius: "50%",
      bgcolor: c.border, border: "2px solid white",
      boxShadow: `0 0 0 2px ${c.border}`,
      flexShrink: 0, mt: 0.4,
    }} />
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const HistorialEstado = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const estId = parseInt(id, 10);
  const establecimiento = MOCK_ESTABLECIMIENTOS.find((e) => e.id === estId);
  const historial = MOCK_HISTORIAL[estId] || [];

  if (!establecimiento) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Establecimiento no encontrado.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>Volver</Button>
      </Box>
    );
  }

  const estadoActual = historial.length > 0 ? historial[historial.length - 1].estadoNuevo : establecimiento.estadoDTE;

  return (
    <Box sx={{ maxWidth: "1100px", mx: "auto" }}>
      {/* ── Encabezado ──────────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <Box sx={{ bgcolor: "#005596", p: 3, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HistoryIcon sx={{ color: "white", fontSize: 32 }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 900, letterSpacing: -0.5 }}>
                Historial de Estados
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Auditoría completa del ciclo de vida del establecimiento
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", textTransform: "none", borderRadius: "8px", "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
          >
            Volver
          </Button>
        </Box>

        {/* Info establecimiento */}
        <Box sx={{ p: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr 1fr" }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>Establecimiento</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1a1a1a" }}>{establecimiento.nombre}</Typography>
            <Typography variant="body2" color="text.secondary">{establecimiento.tipologia}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>CUIT</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>{establecimiento.cuit}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>Origen</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={establecimiento.origen}
                size="small"
                sx={{
                  fontWeight: 700, fontSize: "0.7rem", borderRadius: "4px",
                  bgcolor: establecimiento.origen === "IMPORTADO" ? "#fff3e0" : "#e8f5e9",
                  color: establecimiento.origen === "IMPORTADO" ? "#e65100" : "#2e7d32",
                  border: `1px solid ${establecimiento.origen === "IMPORTADO" ? "#ffb74d" : "#81c784"}`,
                }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>Estado Actual</Typography>
            <Box sx={{ mt: 0.5 }}>
              <EstadoChip estado={estadoActual} />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 3 }}>
        {/* ── Timeline visual ───────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", height: "fit-content" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Línea de tiempo
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            {historial.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                Sin historial registrado.
              </Typography>
            ) : (
              <Box sx={{ position: "relative" }}>
                {/* Línea vertical */}
                <Box sx={{
                  position: "absolute", left: 7, top: 8, bottom: 8,
                  width: 2, bgcolor: "#e2e8f0", borderRadius: 1,
                }} />
                {historial.map((evento, idx) => {
                  const c = getColor(evento.estadoNuevo);
                  const esPrimero = idx === 0;
                  const esUltimo = idx === historial.length - 1;
                  return (
                    <Box key={idx} sx={{ display: "flex", gap: 2, mb: esUltimo ? 0 : 3, position: "relative" }}>
                      <TimelineDot estado={evento.estadoNuevo} />
                      <Box sx={{ flex: 1, pb: esUltimo ? 0 : 0 }}>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>
                          {new Date(evento.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                        </Typography>
                        <EstadoChip estado={evento.estadoNuevo} />
                        <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5 }}>
                          {evento.motivo}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Paper>

        {/* ── Tabla de auditoría ───────────────────────────────────────────── */}
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Registro de auditoría ({historial.length} eventos)
            </Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>FECHA</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>ESTADO ANTERIOR</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>NUEVO ESTADO</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>MOTIVO DE CAMBIO</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>USUARIO</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555", fontSize: "0.72rem" }}>TIPO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historial.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">Sin eventos registrados</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  historial.map((evento, idx) => (
                    <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700 }}>{idx + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", whiteSpace: "nowrap" }}>
                          {new Date(evento.fecha).toLocaleDateString("es-AR")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {evento.estadoAnterior
                          ? <EstadoChip estado={evento.estadoAnterior} />
                          : <Chip label="Inicio" size="small" sx={{ bgcolor: "#f1f5f9", color: "#64748b", borderRadius: "6px", fontWeight: 600 }} />
                        }
                      </TableCell>
                      <TableCell>
                        <EstadoChip estado={evento.estadoNuevo} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.78rem" }}>
                          {evento.motivo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Avatar sx={{ width: 20, height: 20, fontSize: "0.6rem", bgcolor: evento.tipo === "AUTOMÁTICO" ? "#e0f2fe" : "#e8f5e9" }}>
                            {evento.tipo === "AUTOMÁTICO"
                              ? <AutoIcon sx={{ fontSize: 12, color: "#0369a1" }} />
                              : <PersonIcon sx={{ fontSize: 12, color: "#2e7d32" }} />
                            }
                          </Avatar>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>{evento.usuario}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={evento.tipo}
                          size="small"
                          sx={{
                            fontSize: "0.65rem", fontWeight: 700, borderRadius: "4px",
                            bgcolor: evento.tipo === "AUTOMÁTICO" ? "#e0f2fe" : "#f0fdf4",
                            color: evento.tipo === "AUTOMÁTICO" ? "#0369a1" : "#15803d",
                            border: `1px solid ${evento.tipo === "AUTOMÁTICO" ? "#7dd3fc" : "#86efac"}`,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default HistorialEstado;
