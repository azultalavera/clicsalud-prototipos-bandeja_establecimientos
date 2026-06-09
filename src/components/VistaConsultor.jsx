import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  MenuItem,
  Alert,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Badge as BadgeIcon,
  SearchOff as SearchOffIcon,
  InfoOutlined as InfoIcon,
  BusinessOutlined as BusinessIcon,
} from "@mui/icons-material";
import { useData } from "../context/DataContext";

// ─── Helper ───────────────────────────────────────────────────────────────────
const normalize = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getField = (row, ...keys) => {
  for (const key of keys) {
    const found = Object.keys(row).find((k) => k.toLowerCase() === key.toLowerCase());
    if (found !== undefined) return String(row[found] ?? "").trim();
  }
  return "";
};

// ─── Ficha de un establecimiento ─────────────────────────────────────────────
const FichaEstablecimiento = ({ est }) => {
  const nombre =
    est.nombre || est.NOMBRE || est.Nombre ||
    est["ESTABLECIMIENTO"] || est["Establecimiento"] || `Establecimiento #${est.id}`;
  const tipologia = est.tipologia || est.TIPOLOGIA || est["TIPOLOGÍA"] || "";

  const campos = [
    { label: "CUIT", value: getField(est, "cuit", "CUIT") },
    { label: "Expediente", value: getField(est, "expediente", "EXPEDIENTE") },
    { label: "Titularidad", value: getField(est, "titularidad", "TITULARIDAD") },
    { label: "Departamento", value: getField(est, "departamento", "DEPARTAMENTO") },
    { label: "Localidad", value: getField(est, "localidad", "LOCALIDAD") },
    { label: "Estado habilitación", value: getField(est, "estadoEstablecimiento", "estadoDTE") },
  ].filter((c) => c.value);

  const estadoColor = {
    HABILITADO: { bg: "#e8f5e9", text: "#2e7d32", border: "#81c784" },
    "NO HABILITADO": { bg: "#fff3e0", text: "#e65100", border: "#ffb74d" },
  }[String(getField(est, "estadoEstablecimiento") || "").toUpperCase()] || { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}
    >
      <Box sx={{ bgcolor: "#005596", px: 4, py: 3, color: "white", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <BusinessIcon sx={{ fontSize: 40, opacity: 0.7 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>{nombre}</Typography>
          {tipologia && (
            <Chip label={tipologia} size="small" sx={{ mt: 1, fontWeight: 700, fontSize: "0.75rem", bgcolor: "rgba(255,255,255,0.2)", color: "white", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.3)" }} />
          )}
        </Box>
        {getField(est, "estadoEstablecimiento") && (
          <Chip
            label={getField(est, "estadoEstablecimiento")}
            sx={{ fontWeight: 700, fontSize: "0.78rem", bgcolor: estadoColor.bg, color: estadoColor.text, border: `1.5px solid ${estadoColor.border}`, borderRadius: "8px" }}
          />
        )}
      </Box>

      <Box sx={{ px: 4, py: 3, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px 40px" }}>
        {campos.map(({ label, value }) => (
          <Box key={label} sx={{ borderBottom: "1px solid #f1f5f9", pb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b", mt: 0.25 }}>
              {String(value || "—")}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const VistaConsultor = () => {
  const { establecimientos } = useData();

  const [filters, setFilters] = useState({ cuit: "", nombre: "", departamento: "", localidad: "", calle: "" });
  const [resultados, setResultados] = useState(null); // null=sin buscar, []=vacío, [...]
  const [searched, setSearched] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setSearched(false);
    setResultados(null);
  };

  const clearAll = () => {
    setFilters({ cuit: "", nombre: "", departamento: "", localidad: "", calle: "" });
    setSearched(false);
    setResultados(null);
    setCaptchaError(false);
  };

  const handleBuscar = () => {
    if (!captchaVerified) { setCaptchaError(true); return; }
    setCaptchaError(false);

    const found = establecimientos.filter((est) => {
      const cuit = normalize(getField(est, "cuit", "CUIT"));
      const nombre = normalize(getField(est, "nombre", "NOMBRE", "Nombre", "ESTABLECIMIENTO"));
      const departamento = normalize(getField(est, "departamento", "DEPARTAMENTO", "Departamento"));
      const localidad = normalize(getField(est, "localidad", "LOCALIDAD", "Localidad"));
      const calle = normalize(getField(est, "calle", "CALLE", "ubicacion", "UBICACION", "domicilio", "DOMICILIO"));

      const hasAny = filters.cuit || filters.nombre || filters.departamento || filters.localidad || filters.calle;
      if (!hasAny) return false;

      const fCuit = normalize(filters.cuit);
      const fNombre = normalize(filters.nombre);
      const fDepartamento = normalize(filters.departamento);
      const fLocalidad = normalize(filters.localidad);
      const fCalle = normalize(filters.calle);

      if (fCuit && !cuit.includes(fCuit)) return false;
      if (fNombre && !nombre.includes(fNombre)) return false;
      if (fDepartamento && departamento !== fDepartamento) return false;
      if (fLocalidad && localidad !== fLocalidad) return false;
      if (fCalle && !calle.includes(fCalle)) return false;

      return true;
    });

    setResultados(found);
    setSearched(true);
  };

  const departamentos = [...new Set(establecimientos.map(e => String(getField(e, "departamento", "DEPARTAMENTO", "Departamento"))).filter(d => d && d !== "—"))].sort();
  const localidades = [...new Set(establecimientos
    .filter(e => !filters.departamento || String(getField(e, "departamento", "DEPARTAMENTO", "Departamento")) === filters.departamento)
    .map(e => String(getField(e, "localidad", "LOCALIDAD", "Localidad")))
    .filter(l => l && l !== "—")
  )].sort();

  const searchedByCuit = !!filters.cuit;
  const sinResultados = searched && resultados && resultados.length === 0;
  const resultadosExactos = searched && resultados && resultados.length === 1;
  const multiplesPermitidos = searched && resultados && resultados.length > 1 && searchedByCuit;
  const multiplesBloqueados = searched && resultados && resultados.length > 1 && !searchedByCuit;

  return (
    <Box sx={{ maxWidth: "1100px", mx: "auto" }}>
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        {/* Título */}
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1 }}>
            Consulta de Establecimientos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ingresá los datos del establecimiento que desea consultar
          </Typography>
        </Box>

        <Divider sx={{ mx: 3, my: 2 }} />

        <Box sx={{ px: 3, pb: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px", mb: 3 }}>
            <TextField
              fullWidth variant="standard" label="Nombre del establecimiento" name="nombre"
              value={filters.nombre} onChange={handleFilterChange} placeholder="Ej: Clínica del Sol..."
            />
            <TextField
              fullWidth variant="standard" label="CUIL / CUIT del establecimiento" name="cuit"
              value={filters.cuit} onChange={handleFilterChange} placeholder="Ej: 30-12345678-9"
            />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px 32px" }}>
            <TextField
              fullWidth variant="standard" select label="Departamento" name="departamento"
              value={filters.departamento} onChange={handleFilterChange}
            >
              <MenuItem value="">Todos los departamentos</MenuItem>
              {departamentos.map(d => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth variant="standard" select label="Localidad" name="localidad"
              value={filters.localidad} onChange={handleFilterChange}
            >
              <MenuItem value="">Todas las localidades</MenuItem>
              {localidades.map(l => (
                <MenuItem key={l} value={l}>{l}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth variant="standard" label="Calle / Domicilio" name="calle"
              value={filters.calle} onChange={handleFilterChange} placeholder="Ej: San Martín 123"
            />
          </Box>

          {/* reCAPTCHA simulado */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Paper
              elevation={2}
              sx={{
                display: "inline-flex", alignItems: "center", justifyContent: "space-between",
                bgcolor: "#f9f9f9", border: captchaError ? "1px solid #d32f2f" : "1px solid #d3d3d3",
                borderRadius: "3px", p: "8px 12px", width: 300,
                boxShadow: "0px 0px 4px 1px rgba(0,0,0,0.08)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Checkbox
                  checked={captchaVerified}
                  onChange={(e) => { setCaptchaVerified(e.target.checked); if (e.target.checked) setCaptchaError(false); }}
                  sx={{ p: 1, "& .MuiSvgIcon-root": { fontSize: 28 } }}
                />
                <Typography sx={{ fontWeight: 500, color: "#222", fontSize: "14px" }}>No soy un robot</Typography>
              </Stack>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="32" style={{ marginBottom: "2px" }} />
                <Typography sx={{ fontSize: "10px", color: "#555", lineHeight: 1 }}>reCAPTCHA</Typography>
              </Box>
            </Paper>
            {captchaError && (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5, pl: 0.5 }}>
                Por favor, verificá que no sos un robot.
              </Typography>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2, borderTop: "1px dashed #e2e8f0" }}>
            <Button variant="outlined" onClick={clearAll} startIcon={<RefreshIcon />}
              sx={{ borderColor: "#cbd5e1", color: "#64748b", borderRadius: "8px", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" } }}>
              Limpiar
            </Button>
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar}
              sx={{ bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" }, textTransform: "none", fontWeight: 700, borderRadius: "8px", boxShadow: "none", px: 3 }}>
              Buscar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ── Resultados ──────────────────────────────────────────────────────── */}
      {sinResultados && (
        <Alert severity="warning" icon={<SearchOffIcon />} sx={{ borderRadius: "10px" }}>
          No se encontró ningún establecimiento que coincida con los datos ingresados.
        </Alert>
      )}

      {multiplesBloqueados && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: "10px" }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            La búsqueda por aproximación arrojó {resultados.length} coincidencias. Por favor, sea más específico (ej: ingrese el CUIT, o seleccione un Departamento/Localidad) para ver los datos.
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            Nota: Solo se muestran listas completas si la búsqueda incluye un N° de CUIT.
          </Typography>
        </Alert>
      )}

      {multiplesPermitidos && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: "10px", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Se encontraron {resultados.length} establecimientos asociados al CUIT ingresado.
            </Typography>
          </Alert>

          <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
            <TableContainer>
              <Table sx={{ minWidth: 1000 }} size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#005596" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO ESTAB.</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTABLECIMIENTO</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>EXPEDIENTE</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>CUIT</TableCell>
                    <TableCell align="center" sx={{ bgcolor: "#005596" }}>
                      <Typography sx={{ fontWeight: 700, color: "white", fontSize: "0.75rem" }}>ESTADO DE TRÁMITE</Typography>
                      <Typography sx={{ fontWeight: 700, fontStyle: "italic", color: "#ccc", fontSize: "0.70rem" }}>Tipo de Trámite</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TIPOLOGÍA</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>UBICACIÓN</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TITULARIDAD</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultados.map((est) => {
                    const estadoEstablecimientoVal = getField(est, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO", "EstadoEstablecimiento", "estado") || "—";
                    const estadoTramiteVal = getField(est, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite") || "—";
                    const tipoTramiteVal = getField(est, "tipoTramite", "TIPOTRAMITE", "tipo_tramite") || "—";
                    
                    const colorEstablecimiento = String(estadoEstablecimientoVal).toUpperCase() === "HABILITADO" ? "#2e7d32" : "#c62828";
                    
                    let colorTramite = "#1565c0";
                    const v = String(estadoTramiteVal).toUpperCase();
                    if (v.includes("RECHAZADO")) colorTramite = "#c62828";
                    else if (v === "FINALIZADO") colorTramite = "#1b5e20";
                    else if (v.includes("ACEPTADO")) colorTramite = "#2e7d32";
                    else if (v.includes("OBSERVADO")) colorTramite = "#e65100";
                    else if (v.includes("ADECUADO")) colorTramite = "#6a1b9a";

                    const colorObj = { bg: `${colorTramite}15`, text: colorTramite, border: `${colorTramite}30` };

                    return (
                      <TableRow key={est.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>
                          <Chip
                            label={estadoEstablecimientoVal}
                            size="small"
                            sx={{
                              fontWeight: "bold", fontSize: "0.7rem",
                              bgcolor: `${colorEstablecimiento}15`, color: colorEstablecimiento,
                              borderRadius: "4px", border: `1px solid ${colorEstablecimiento}30`,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                            {getField(est, "nombre", "NOMBRE", "Nombre", "ESTABLECIMIENTO", "Establecimiento", "establecimiento") || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                            {getField(est, "expediente", "EXPEDIENTE", "Expediente") || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {getField(est, "cuit", "CUIT", "Cuit") || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack spacing={0.5} alignItems="center">
                            <Chip
                              label={estadoTramiteVal}
                              size="small"
                              sx={{
                                fontWeight: "bold", fontSize: "0.7rem",
                                bgcolor: colorObj.bg, color: colorObj.text,
                                borderRadius: "4px", border: `1px solid ${colorObj.border}`,
                                maxWidth: 200, whiteSpace: "normal", height: "auto",
                                "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 },
                              }}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {getField(est, "tipologia", "TIPOLOGÍA", "Tipologia", "TIPOLOGIA") || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {getField(est, "localidad", "LOCALIDAD", "Localidad", "ubicacion", "UBICACION") || "—"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#777" }}>
                            {getField(est, "departamento", "DEPARTAMENTO", "Departamento")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {getField(est, "titularidad", "TITULARIDAD", "Titularidad") || "—"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {resultadosExactos && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {resultados.map((est) => (
            <FichaEstablecimiento key={est.id} est={est} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default VistaConsultor;
