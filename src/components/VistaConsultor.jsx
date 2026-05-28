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
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useData } from "../context/DataContext";

// Renders a single establishment "ficha" detail card
const FichaEstablecimiento = ({ est }) => {
  const entries = Object.entries(est).filter(([key, value]) => {
    if (key === "id") return false;
    if (String(key).toUpperCase().includes("__EMPTY")) return false;
    if (key === "color") return false;
    const v = String(value ?? "").trim();
    if (!v || v === "—" || v === "-" || v === "undefined" || v === "null") return false;
    return true;
  });

  const estadoColor = est.color || "#005596";
  const tipologia = est.tipologia || est.TIPOLOGIA || est["TIPOLOGÍA"] || est.Tipologia || est.Tipología || "";
  const nombre =
    est.nombre || est.NOMBRE || est.Nombre ||
    est["ESTABLECIMIENTO"] || est["Establecimiento"] || est["establecimiento"] ||
    est["Nombre del Establecimiento"] || `Establecimiento #${est.id}`;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        mt: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: "#005596", px: 4, py: 3, color: "white", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
            {nombre}
          </Typography>
          {tipologia && (
            <Chip
              label={tipologia}
              size="small"
              sx={{
                mt: 1,
                fontWeight: 700,
                fontSize: "0.75rem",
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            />
          )}
        </Box>
      </Box>

      {/* Fields: 3 columns */}
      <Box sx={{ px: 4, py: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px 40px" }}>
          {entries.map(([key, value]) => (
            <Box key={key} sx={{ borderBottom: "1px solid #f1f5f9", pb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {key}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b", mt: 0.25 }}>
                {String(value || "—")}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// ─── Helper: busca un campo en el row de forma flexible ───────────────────────
const getField = (row, ...keys) => {
  for (const key of keys) {
    const found = Object.keys(row).find((k) => k.toLowerCase() === key.toLowerCase());
    if (found !== undefined) return row[found] ?? "";
  }
  return "";
};

const VistaConsultor = () => {
  const { establecimientos } = useData();
  const [resultado, setResultado] = useState(null); // null = sin buscar, false = no encontrado, objeto = encontrado
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({
    nombre: "", cuit: "", departamento: "", localidad: "",
  });
  
  // Captcha visual
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setSearched(false);
    setResultado(null);
  };

  const clearFilters = () => {
    setFilters({ nombre: "", cuit: "", departamento: "", localidad: "" });
    setSearched(false);
    setResultado(null);
  };

  const handleBuscar = () => {
    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    const isAnyFilterActive = Object.values(filters).some(v => v !== "");
    if (!isAnyFilterActive) {
      setResultado(false);
      setSearched(true);
      return;
    }

    const found = establecimientos.filter((est) => {
      const cuit = String(getField(est, "cuit", "CUIT", "Cuit")).toLowerCase();
      const departamento = String(getField(est, "departamento", "DEPARTAMENTO", "Departamento"));
      const localidad = String(getField(est, "localidad", "LOCALIDAD", "Localidad", "ubicacion", "UBICACION", "Ubicacion", "Ubicación", "UBICACIÓN")).toLowerCase();
      const nombre = String(getField(est, "nombre", "NOMBRE", "Nombre", "ESTABLECIMIENTO", "Establecimiento", "establecimiento")).toLowerCase();

      if (filters.nombre && !nombre.includes(filters.nombre.toLowerCase())) return false;
      if (filters.cuit && !cuit.includes(filters.cuit.toLowerCase())) return false;
      if (filters.departamento && departamento !== filters.departamento) return false;
      if (filters.localidad && !localidad.includes(filters.localidad.toLowerCase())) return false;

      return true;
    });

    setResultado(found.length > 0 ? found : false);
    setSearched(true);
  };

  const sinDatos = establecimientos.length === 0;

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1, p: 2 }}>
          Bandeja de Establecimientos
        </Typography>

        {/* Campos de filtros */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px 32px", mb: 3 }}>
            <TextField fullWidth variant="standard" label="Nombre del establecimiento" name="nombre"
              value={filters.nombre} onChange={handleFilterChange} placeholder="Buscar por nombre..." />
            <TextField fullWidth variant="standard" label="CUIT" name="cuit"
              value={filters.cuit} onChange={handleFilterChange} placeholder="Ej: 30-12345678-9" />
            <TextField fullWidth variant="standard" select label="Departamento" name="departamento"
              value={filters.departamento} onChange={handleFilterChange}>
              <MenuItem value="">Todos los departamentos</MenuItem>
              <MenuItem value="Capital">Capital</MenuItem>
              <MenuItem value="Río Cuarto">Río Cuarto</MenuItem>
              <MenuItem value="Punilla">Punilla</MenuItem>
              <MenuItem value="Colón">Colón</MenuItem>
              <MenuItem value="General San Martín">General San Martín</MenuItem>
              <MenuItem value="Tercero Arriba">Tercero Arriba</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" label="Localidad" name="localidad"
              value={filters.localidad} onChange={handleFilterChange} placeholder="Ej: Córdoba" />
          </Box>

          {/* Captcha */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#f9f9f9",
                border: captchaError ? "1px solid #d32f2f" : "1px solid #d3d3d3",
                borderRadius: "3px",
                p: "8px 12px",
                width: 300,
                boxShadow: "0px 0px 4px 1px rgba(0,0,0,0.08)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Checkbox
                  checked={captchaVerified}
                  onChange={(e) => {
                    setCaptchaVerified(e.target.checked);
                    if (e.target.checked) setCaptchaError(false);
                  }}
                  sx={{ p: 1, "& .MuiSvgIcon-root": { fontSize: 28 } }}
                />
                <Typography sx={{ fontWeight: 500, color: "#222", fontSize: "14px" }}>
                  No soy un robot
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="32" style={{ marginBottom: "2px" }} />
                <Typography sx={{ fontSize: "10px", color: "#555", lineHeight: 1 }}>
                  reCAPTCHA
                </Typography>
              </Box>
            </Paper>
            {captchaError && (
              <Typography variant="caption" color="error" sx={{ pl: 0.5 }}>
                Por favor, verificá que no sos un robot.
              </Typography>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4, pt: 2, borderTop: "1px dashed #e2e8f0" }}>
            <Button variant="outlined" onClick={clearFilters} startIcon={<RefreshIcon />}
              sx={{
                borderColor: "#cbd5e1", color: "#64748b", borderRadius: "8px",
                textTransform: "none", fontWeight: 600,
                "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" }
              }}>
              Limpiar
            </Button>
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar}
              sx={{
                bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" },
                textTransform: "none", fontWeight: 700, borderRadius: "8px",
                boxShadow: "none", px: 3
              }}>
              Buscar
            </Button>
          </Box>
        </Box>
      </Paper>

      {sinDatos && (
        <Alert severity="info" sx={{ borderRadius: "8px" }}>
          No hay establecimientos cargados en el sistema. Importá un Excel desde el botón superior.
        </Alert>
      )}

      {/* Result */}
      {searched && resultado === false && !sinDatos && (
        <Alert severity="warning" sx={{ borderRadius: "8px" }}>
          No se encontró ningún establecimiento que coincida con los filtros ingresados. O bien no ingresaste ningún filtro.
        </Alert>
      )}

      {searched && resultado && Array.isArray(resultado) && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {resultado.map((est) => (
            <FichaEstablecimiento key={est.id} est={est} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default VistaConsultor;
