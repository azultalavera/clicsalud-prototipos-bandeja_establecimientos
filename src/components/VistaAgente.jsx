import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  CloudDownload as CloudDownloadIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useData } from "../context/DataContext";
import DetalleEstablecimientoDialog from "./DetalleEstablecimientoDialog";


// ─── Estado color ─────────────────────────────────────────────────────────────
const getEstadoEstablecimientoColor = (value) => {
  const v = String(value || "").toUpperCase();
  if (v.includes("HABILITADO") && !v.includes("NO")) return "#2e7d32";
  if (v.includes("VENCIDO")) return "#d32f2f";
  if (v.includes("VENCER")) return "#f57f17";
  if (v.includes("NO VIGENTE") || v.includes("NOVIGENTE")) return "#004582";
  if (v.includes("MODIF")) return "#6a1b9a";
  if (v.includes("RENOV")) return "#005596";
  return "#005596";
};

const getEstadoTramiteColor = (value) => {
  if (!value || value === "-") return "#9e9e9e";
  const v = String(value).toUpperCase();
  if (v.includes("ACEPTADO")) return "#2e7d32";
  if (v.includes("ANÁLISIS") || v.includes("ANALISIS")) return "#e65100";
  if (v.includes("RESPUESTA")) return "#c62828";
  if (v.includes("MODIFICACIÓN")) return "#6a1b9a";
  if (v.includes("RENOVACIÓN")) return "#005596";
  return "#1565c0";
};

// ─── Acciones contextuales según estado ───────────────────────────────────────
const ACCIONES_POR_ESTADO = {
  "EN PROCESO DE MODIFICACIÓN": [
    { label: "Continuar", icon: <EditIcon fontSize="small" />, color: "rgb(9, 155, 227)", primary: true },
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
  "HABILITADO": [
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
    { label: "Descargar", icon: <CloudDownloadIcon fontSize="small" />, color: "rgb(9, 155, 227)" },
    { label: "Ver Resolución", icon: <DescriptionIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
    { label: "Certificado", icon: <AssignmentIcon fontSize="small" />, color: "rgb(175, 65, 120)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
  "PRÓXIMO A VENCER": [
    { label: "Iniciar Renovación", icon: <EditIcon fontSize="small" />, color: "rgb(9, 155, 227)", primary: true },
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
    { label: "Descargar", icon: <CloudDownloadIcon fontSize="small" />, color: "rgb(9, 155, 227)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
  "VENCIDO": [
    { label: "Continuar", icon: <EditIcon fontSize="small" />, color: "rgb(9, 155, 227)", primary: true },
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
  "NO VIGENTE": [
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
    { label: "Ver Resolución", icon: <DescriptionIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
};

const DEFAULT_ACCIONES = [
  { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
  { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
];

const AccionesCell = ({ row, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const estado = getField(row, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO") || "";
  const accionesEstado = ACCIONES_POR_ESTADO[estado.toUpperCase()] || DEFAULT_ACCIONES;
  const primaryAction = accionesEstado.find((a) => a.primary);
  const secondaryActions = accionesEstado.filter((a) => !a.primary);

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
      {primaryAction && (
        <Tooltip title={primaryAction.label} arrow>
          <IconButton size="small" sx={{ color: primaryAction.color }}
            onClick={() => { if (primaryAction.label === "Visualizar" && onView) { onView(row); } else { alert(`${primaryAction.label}: ${row.nombre || row.NOMBRE || row.id}`); } }}>
            {primaryAction.icon}
          </IconButton>
        </Tooltip>
      )}
      {secondaryActions.length > 0 && (
        <>
          <Tooltip title="Más acciones" arrow>
            <IconButton size="small" sx={{ color: "#888" }} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ elevation: 3, sx: { borderRadius: "8px", minWidth: 180, mt: 0.5 } }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {secondaryActions.map((accion) => (
              <MenuItem key={accion.label}
                onClick={() => { setAnchorEl(null); if (accion.label === "Visualizar" && onView) { onView(row); } else { alert(`${accion.label}: ${row.nombre || row.NOMBRE || row.id}`); } }}
                sx={{ py: 1, fontSize: "0.875rem", "&:hover": { bgcolor: "#f8fafc" } }}>
                <ListItemIcon sx={{ color: accion.color, minWidth: 32 }}>{accion.icon}</ListItemIcon>
                <ListItemText primary={accion.label} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
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

// ─── Vista Efector / Agente ───────────────────────────────────────────────────
const VistaAgente = ({ titulo = "Bandeja de Establecimientos — Agente" }) => {
  const [viewData, setViewData] = useState(null);
  const { establecimientos } = useData();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    nombre: "",
    expediente: "",
    cuit: "",
    tipologia: "",
    tipoTramite: "",
    departamento: "",
    localidad: "",
    estadoTramite: "",
    estadoEstablecimiento: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ nombre: "", expediente: "", cuit: "", tipologia: "", tipoTramite: "", departamento: "", localidad: "", estadoTramite: "", estadoEstablecimiento: "", fechaDesde: "", fechaHasta: "" });
    setPage(0);
  };

  const filteredData = establecimientos.filter((est) => {
    const nombre = String(getField(est, "nombre", "NOMBRE", "Nombre")).toLowerCase();
    const expediente = String(getField(est, "expediente", "EXPEDIENTE", "Expediente")).toLowerCase();
    const cuit = String(getField(est, "cuit", "CUIT", "Cuit")).toLowerCase();
    const tipologia = String(getField(est, "tipologia", "TIPOLOGÍA", "Tipologia", "TIPOLOGIA"));
    const tipoTramite = String(getField(est, "tipoTramite", "TIPOTRAMITE", "Tipo Tramite", "TipoTramite", "tipo_tramite"));
    const departamento = String(getField(est, "departamento", "DEPARTAMENTO", "Departamento"));
    const localidad = String(getField(est, "localidad", "LOCALIDAD", "Localidad")).toLowerCase();
    const estadoTramite = String(getField(est, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite"));
    const estadoEstablecimiento = String(getField(est, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO", "EstadoEstablecimiento", "estado"));
    const fecha = String(getField(est, "fechaCreacion", "fecha_creacion", "Fecha", "FECHA", "fechaingreso", "Fecha Ingreso"));

    if (filters.nombre && !nombre.includes(filters.nombre.toLowerCase())) return false;
    if (filters.expediente && !expediente.includes(filters.expediente.toLowerCase())) return false;
    if (filters.cuit && !cuit.includes(filters.cuit.toLowerCase())) return false;
    if (filters.tipologia && tipologia !== filters.tipologia) return false;
    if (filters.tipoTramite && tipoTramite !== filters.tipoTramite) return false;
    if (filters.departamento && departamento !== filters.departamento) return false;
    if (filters.localidad && !localidad.includes(filters.localidad.toLowerCase())) return false;
    if (filters.estadoTramite && !estadoTramite.toUpperCase().includes(filters.estadoTramite.toUpperCase())) return false;
    if (filters.estadoEstablecimiento && estadoEstablecimiento !== filters.estadoEstablecimiento) return false;
    return true;
  });

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const sinDatos = establecimientos.length === 0;

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      {/* === FILTROS === */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1, p: 2 }}>
          {titulo}
        </Typography>



        <Box sx={{ p: 3 }}>
          {/* Fila 1: N° Expediente · Nombre · CUIT */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px 32px", mb: 3 }}>
            <TextField fullWidth variant="standard" label="N° Expediente" name="expediente"
              value={filters.expediente} onChange={handleFilterChange} placeholder="Ej: 0425-382230/2026" />
            <TextField fullWidth variant="standard" label="Nombre del establecimiento" name="nombre"
              value={filters.nombre} onChange={handleFilterChange} placeholder="Buscar por nombre..." />
            <TextField fullWidth variant="standard" label="CUIT" name="cuit"
              value={filters.cuit} onChange={handleFilterChange} placeholder="Ej: 30-12345678-9" />
          </Box>

          {/* Fila 2: Estado · Fecha desde · Tipología */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px 32px", mb: 3 }}>
            <TextField fullWidth variant="standard" label="Estado del Trámite" name="estadoTramite"
              value={filters.estadoTramite} onChange={handleFilterChange} placeholder="Buscar por estado del trámite..." />
            <TextField fullWidth variant="standard" select label="Estado Establecimiento" name="estadoEstablecimiento"
              value={filters.estadoEstablecimiento} onChange={handleFilterChange}>
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="HABILITADO">Habilitado</MenuItem>
              <MenuItem value="EN PROCESO MODIFICACIÓN">En Proceso Modificación</MenuItem>
              <MenuItem value="PRÓXIMO A VENCER">Próximo a Vencer</MenuItem>
              <MenuItem value="EN PROCESO RENOVACIÓN">En Proceso Renovación</MenuItem>
              <MenuItem value="VENCIDO">Vencido</MenuItem>
              <MenuItem value="NO VIGENTE">No Vigente</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" label="Fecha desde" name="fechaDesde" 
              type={filters.fechaDesde ? "date" : "text"}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => { if (!filters.fechaDesde) e.target.type = "text"; }}
              slotProps={{ inputLabel: { shrink: true } }} value={filters.fechaDesde} onChange={handleFilterChange} placeholder="dd/mm/aaaa" />
            <TextField fullWidth variant="standard" select label="Tipología" name="tipologia"
              value={filters.tipologia} onChange={handleFilterChange}>
              <MenuItem value="">Todas las tipologías</MenuItem>
              <MenuItem value="CLÍNICAS, SANATORIOS y HOSPITALES">Clínicas, Sanatorios y Hospitales</MenuItem>
              <MenuItem value="ESTABLECIMIENTOS GERIÁTRICOS">Establecimientos Geriátricos</MenuItem>
              <MenuItem value="CENTRO DE SALUD AMBULATORIO">Centro de Salud Ambulatorio</MenuItem>
              <MenuItem value="CENTRO DE CIRUGÍA AMBULATORIA">Centro de Cirugía Ambulatoria</MenuItem>
            </TextField>
          </Box>

          {/* Fila 3: Tipo de Trámite · Departamento · Localidad */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px 32px" }}>
            <TextField fullWidth variant="standard" select label="Tipo de Trámite" name="tipoTramite"
              value={filters.tipoTramite} onChange={handleFilterChange}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Habilitación">Habilitación</MenuItem>
              <MenuItem value="Renovación">Renovación</MenuItem>
              <MenuItem value="Modificación">Modificación</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" select label="Departamento" name="departamento"
              value={filters.departamento} onChange={handleFilterChange}>
              <MenuItem value="">Todos los departamentos</MenuItem>
              <MenuItem value="Capital">Capital</MenuItem>
              <MenuItem value="Río Cuarto">Río Cuarto</MenuItem>
              <MenuItem value="Punilla">Punilla</MenuItem>
              <MenuItem value="Colón">Colón</MenuItem>
              <MenuItem value="General San Martín">General San Martín</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" label="Localidad" name="localidad"
              value={filters.localidad} onChange={handleFilterChange} placeholder="Ej: Córdoba" />
          </Box>

          {/* Botones */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4, pt: 2, borderTop: "1px dashed #e2e8f0" }}>
            <Button variant="outlined" onClick={clearFilters} startIcon={<RefreshIcon />}
              sx={{ borderColor: "#cbd5e1", color: "#64748b", borderRadius: "8px", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" } }}>
              Limpiar
            </Button>
            <Button variant="contained" startIcon={<SearchIcon />}
              sx={{ bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" }, textTransform: "none", fontWeight: 700, borderRadius: "8px", boxShadow: "none", px: 3 }}>
              Buscar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Sin datos */}
      {sinDatos && (
        <Alert severity="info" sx={{ borderRadius: "8px", mb: 3 }}>
          No hay establecimientos cargados. Usá el botón <strong>Importar Excel</strong> en el encabezado para cargar datos.
        </Alert>
      )}

      {/* === TABLA === */}
      {!sinDatos && (
        <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 1000 }} size="medium">
              <TableHead>
              <TableRow sx={{ bgcolor: "#005596" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>EXPEDIENTE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "white", bgcolor: "#005596" }}>CUIT</TableCell>
                <TableCell align="center" sx={{ bgcolor: "#005596" }}>
                  <Typography sx={{ fontWeight: 700, color: "white", fontSize: "0.75rem" }}>ESTADO DE TRÁMITE</Typography>
                  <Typography sx={{ fontWeight: 700, fontStyle: "italic", color: "#ccc", fontSize: "0.70rem" }}>Tipo de Trámite</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "white", bgcolor: "#005596" }}>TIPOLOGÍA</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>UBICACIÓN</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TITULARIDAD</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                  const estadoTramiteVal = getField(row, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite") || "—";
                  const estadoEstablecimientoVal = getField(row, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO", "EstadoEstablecimiento", "estado") || "—";
                  const colorTramite = getEstadoTramiteColor(estadoTramiteVal);
                  const colorEstablecimiento = getEstadoEstablecimientoColor(estadoEstablecimientoVal);
                  return (
                  <TableRow key={row.id ?? idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
                        {getField(row, "nombre", "NOMBRE", "Nombre", "ESTABLECIMIENTO", "Establecimiento", "establecimiento") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                        {getField(row, "expediente", "EXPEDIENTE", "Expediente") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "cuit", "CUIT", "Cuit") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack spacing={0.5} alignItems="center">
                        <Chip
                          label={estadoTramiteVal}
                          size="small"
                          sx={{
                            bgcolor: `${colorTramite}15`,
                            color: colorTramite,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 24,
                            border: `1px solid ${colorTramite}30`
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontStyle: "italic", color: "#757575", textTransform: "uppercase", fontSize: "0.65rem" }}>
                          {getField(row, "tipoTramite", "TIPOTRAMITE", "tipo_tramite") || "—"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "tipologia", "TIPOLOGÍA", "Tipologia", "TIPOLOGIA") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "localidad", "LOCALIDAD", "Localidad", "ubicacion", "UBICACION", "Ubicacion", "Ubicación", "UBICACIÓN") || "—"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#777" }}>
                        {getField(row, "departamento", "DEPARTAMENTO", "Departamento")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "titularidad", "TITULARIDAD", "Titularidad") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <AccionesCell row={row} onDelete={typeof setConfirmDelete !== 'undefined' ? (r) => setConfirmDelete(r) : undefined} onView={(r) => setViewData(r)} />
                    </TableCell>
                  </TableRow>
                );
                })}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">No se encontraron resultados</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </Paper>
      )}
      {/* === DIÁLOGO DETALLE ESTABLECIMIENTO === */}
      <DetalleEstablecimientoDialog open={Boolean(viewData)} data={viewData} onClose={() => setViewData(null)} />

    </Box>
  );
};

export default VistaAgente;
