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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  Delete as DeleteOutlineIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useData } from "../context/DataContext";
import DetalleEstablecimientoDialog from "./DetalleEstablecimientoDialog";
import NuevoEstablecimientoDialog from "./NuevoEstablecimientoDialog";
import { useNavigate } from "react-router-dom";
import { DTE_TRAMITE, DTE_IMPORTADO, ESTADO_LABELS } from "../data/mockData";


// ─── Estado color ─────────────────────────────────────────────────────────────
const getEstadoEstablecimientoColor = (value) => {
  const v = String(value || "").toUpperCase();
  if (v === "HABILITADO") return "#2e7d32";
  return "#c62828"; // NO HABILITADO y cualquier otro
};

const getEstadoTramiteColor = (value) => {
  if (!value || value === "-" || value === "—") return "#9e9e9e";
  const v = String(value).toUpperCase();
  // Rechazados
  if (v.includes("RECHAZADO")) return "#c62828";
  // Finales positivos
  if (v === "FINALIZADO") return "#1b5e20";
  if (v.includes("ACEPTADO") && v.includes("INSPECCION")) return "#2e7d32";
  if (v.includes("ACEPTADO")) return "#388e3c";
  if (v.includes("ENPROTOCOLIZACION") || v.includes("PROTOCOLIZACION")) return "#00695c";
  // Observados
  if (v.includes("OBSERVADO") && v.includes("INSPECCION")) return "#bf360c";
  if (v.includes("OBSERVADO")) return "#e65100";
  // Rectificados
  if (v.includes("RECTIFICADO")) return "#f57f17";
  // Respuesta emplazamiento
  if (v.includes("RESPUESTA") || v.includes("EMPLAZAMIENTO")) return "#6d4c41";
  // Análisis
  if (v.includes("ANALISIS") || v.includes("ANÁLISIS")) return "#1565c0";
  // Adecuados
  if (v.includes("ADECUADO") && v.includes("OBSERVACIONES")) return "#6a1b9a";
  if (v.includes("ADECUADO")) return "#2e7d32";
  // Pendientes / borradores
  if (v.includes("PENDIENTE")) return "#78909c";
  if (v.includes("BORRADOR")) return "#90a4ae";
  // Importado
  if (v === "IMPORTADO") return "#e65100";
  return "#1565c0";
};

// ─── Chip de ORIGEN ───────────────────────────────────────────────────────────
const OrigenChip = ({ value }) => {
  if (!value) return <Typography variant="body2" sx={{ color: "#bbb" }}>—</Typography>;
  const v = String(value).toUpperCase();
  const palette = {
    "IMPORTADO": { bgcolor: "#fff3e0", color: "#e65100", border: "1px solid #ffb74d", label: "IMPORTADO" },
    "TRAMITE EN CLICSALUD": { bgcolor: "#e8f5e9", color: "#2e7d32", border: "1px solid #81c784", label: "TRÁMITE EN CLICSALUD" },
  };
  const entry = palette[v] || { bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", label: value };
  const { label, ...sx } = entry;
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontWeight: "bold", fontSize: "0.7rem", borderRadius: "4px", ...sx }}
    />
  );
};

// ─── Chip de TIPO TRÁMITE ─────────────────────────────────────────────────────
const TipoTramiteChip = ({ value }) => {
  if (!value || value === "—") return <Typography variant="body2" sx={{ color: "#bbb" }}>—</Typography>;
  const v = String(value).toUpperCase();
  const palette = {
    "HABILITACION": { bgcolor: "#e3f2fd", color: "#0d47a1", border: "1px solid #90caf9", label: "HABILITACIÓN" },
    "ALTA DIGITAL":  { bgcolor: "#f3e5f5", color: "#6a1b9a", border: "1px solid #ce93d8", label: "ALTA DIGITAL" },
    "RENOVACION":   { bgcolor: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", label: "RENOVACIÓN" },
    "MODIFICACION": { bgcolor: "#fff3e0", color: "#e65100", border: "1px solid #ffcc80", label: "MODIFICACIÓN" },
  };
  const entry = palette[v] || { bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", label: value };
  const { label, ...sx } = entry;
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontWeight: "bold", fontSize: "0.7rem", borderRadius: "4px", ...sx }}
    />
  );
};

// ─── Acciones según DTE y origen ─────────────────────────────────────────────
const getAccionesParaEstado = (estadoDTE, origen) => {
  return [
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
  ];
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const getField = (row, ...keys) => {
  for (const key of keys) {
    const found = Object.keys(row).find((k) => k.toLowerCase() === key.toLowerCase());
    if (found !== undefined) return row[found] ?? "";
  }
  return "";
};

// ─── Vista Ministerio ─────────────────────────────────────────────────────────
const VistaMinisterio = () => {
  const [viewData, setViewData] = useState(null);
  const [openNuevoDialog, setOpenDialog] = useState(false);
  const { establecimientos, eliminarEstablecimiento, agregarDesdeExcel } = useData();
  const [page, setPage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null); // row a eliminar
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
    origen: "",
    tipoTramiteClase: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ nombre: "", expediente: "", cuit: "", tipologia: "", tipoTramite: "", departamento: "", localidad: "", estadoTramite: "", estadoEstablecimiento: "", fechaDesde: "", fechaHasta: "", origen: "", tipoTramiteClase: "" });
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
    const origen = String(getField(est, "origen", "ORIGEN", "Origen")).toUpperCase();

    if (filters.nombre && !nombre.includes(filters.nombre.toLowerCase())) return false;
    if (filters.expediente && !expediente.includes(filters.expediente.toLowerCase())) return false;
    if (filters.cuit && !cuit.includes(filters.cuit.toLowerCase())) return false;
    if (filters.tipologia && tipologia !== filters.tipologia) return false;
    if (filters.tipoTramite && tipoTramite !== filters.tipoTramite) return false;
    if (filters.departamento && departamento !== filters.departamento) return false;
    if (filters.localidad && !localidad.includes(filters.localidad.toLowerCase())) return false;
    if (filters.estadoTramite && !estadoTramite.toUpperCase().includes(filters.estadoTramite.toUpperCase())) return false;
    if (filters.estadoEstablecimiento && estadoEstablecimiento !== filters.estadoEstablecimiento) return false;
    if (filters.origen && origen !== filters.origen.toUpperCase()) return false;
    return true;
  });

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      {/* === FILTROS === */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1 }}>
            Bandeja de Establecimientos
          </Typography>
          <Tooltip title="Nuevo Establecimiento" arrow>
            <IconButton 
              onClick={() => setOpenDialog(true)}
              sx={{ color: "#005596", "&:hover": { bgcolor: "rgba(0, 85, 150, 0.1)" } }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>



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
              <MenuItem value="NO HABILITADO">No Habilitado</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" select label="Tipología" name="tipologia"
              value={filters.tipologia} onChange={handleFilterChange}>
              <MenuItem value="">Todas las tipologías</MenuItem>
              <MenuItem value="CLÍNICAS, SANATORIOS y HOSPITALES">Clínicas, Sanatorios y Hospitales</MenuItem>
              <MenuItem value="ESTABLECIMIENTOS GERIÁTRICOS">Establecimientos Geriátricos</MenuItem>
              <MenuItem value="CENTRO DE SALUD AMBULATORIO">Centro de Salud Ambulatorio</MenuItem>
              <MenuItem value="CENTRO DE CIRUGÍA AMBULATORIA">Centro de Cirugía Ambulatoria</MenuItem>
            </TextField>
          </Box>

          {/* Fila 3: Tipo de Trámite · Departamento · Localidad · Origen */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px 32px" }}>
            <TextField fullWidth variant="standard" select label="Tipo de Trámite" name="tipoTramite"
              value={filters.tipoTramite} onChange={handleFilterChange}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="HABILITACION">Habilitación</MenuItem>
              <MenuItem value="ALTA DIGITAL">Alta Digital</MenuItem>
              <MenuItem value="RENOVACION">Renovación</MenuItem>
              <MenuItem value="MODIFICACION">Modificación</MenuItem>
            </TextField>
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

      {/* === TOTALIZADOR === */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#475569" }}>
          Total de resultados: <Chip label={filteredData.length} size="small" sx={{ bgcolor: "#005596", color: "white", fontWeight: "bold", ml: 1 }} />
        </Typography>
      </Box>

      {/* === TABLA === */}
      <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }} size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: "#005596" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>EXPEDIENTE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "white", bgcolor: "#005596" }}>CUIT</TableCell>
                <TableCell align="center" sx={{ bgcolor: "#005596" }}>
                  <Typography sx={{ fontWeight: 700, color: "white", fontSize: "0.875rem" }}>
                    ESTADO DE TRÁMITE
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontStyle: "italic", color: "#ccc", fontSize: "0.75rem" }}>
                    Tipo de Trámite
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "white", bgcolor: "#005596" }}>TIPOLOGÍA</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>UBICACIÓN</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TITULARIDAD</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                const estadoTramiteVal = ESTADO_LABELS[getField(row, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite")] || getField(row, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite") || "—";
                const estadoEstablecimientoVal = getField(row, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO", "EstadoEstablecimiento", "estado") || "—";
                const colorTramite = getEstadoTramiteColor(estadoTramiteVal);
                const colorEstablecimiento = getEstadoEstablecimientoColor(estadoEstablecimientoVal);
                const tipoTramiteVal = getField(row, "tipoTramite", "TIPOTRAMITE", "tipo_tramite") || "—";
                const colorObj = { bg: `${colorTramite}15`, text: colorTramite, border: `${colorTramite}30` };
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
                            bgcolor: colorObj.bg,
                            color: colorObj.text,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 24,
                            border: `1px solid ${colorObj.border}`
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontStyle: "italic", color: "#757575", textTransform: "uppercase", fontSize: "0.65rem" }}>
                          {tipoTramiteVal}
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
                      <Typography variant="body2" sx={{ fontWeight: "bold", color: "#424242", fontSize: "0.8rem", textTransform: "uppercase" }}>
                        {getField(row, "titularidad", "TITULARIDAD", "Titularidad") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        {getAccionesParaEstado(
                          getField(row, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite"),
                          getField(row, "origen", "ORIGEN", "Origen")
                        ).map((accion, i) => (
                          <Tooltip key={i} title={accion.label} arrow>
                            <IconButton
                              size="small"
                              sx={{
                                color: accion.color,
                                bgcolor: accion.color.replace("rgb", "rgba").replace(")", ", 0.1)"),
                                "&:hover": { bgcolor: accion.color.replace("rgb", "rgba").replace(")", ", 0.2)") },
                                border: accion.primary ? `1px solid ${accion.color}` : "none"
                              }}
                              onClick={() => {
                                if (accion.label === "Visualizar") setViewData(row);
                                // Las demás acciones pueden conectarse aquí
                              }}
                            >
                              {accion.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">No se encontraron resultados</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Paper>

      {/* === DIÁLOGO DETALLE ESTABLECIMIENTO === */}
      <DetalleEstablecimientoDialog open={Boolean(viewData)} data={viewData} onClose={() => setViewData(null)} />

      <NuevoEstablecimientoDialog 
        open={openNuevoDialog} 
        onClose={() => setOpenDialog(false)} 
        onSave={(data) => {
          agregarDesdeExcel([data]);
          setOpenDialog(false);
        }} 
      />

      {/* === DIÁLOGO CONFIRMACIÓN ELIMINAR === */}
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        PaperProps={{ sx: { borderRadius: "12px", minWidth: 380 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#c62828", pb: 1 }}>
          Eliminar establecimiento
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#333" }}>
            ¿Estás seguro de que querés eliminar{" "}
            <strong>{confirmDelete?.nombre || confirmDelete?.NOMBRE || `#${confirmDelete?.id}`}</strong>?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDelete(null)}
            variant="outlined"
            sx={{ textTransform: "none", borderColor: "#cbd5e1", color: "#64748b", borderRadius: "8px", fontWeight: 600, "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" } }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => { eliminarEstablecimiento(confirmDelete.id); setConfirmDelete(null); }}
            variant="contained"
            sx={{ textTransform: "none", bgcolor: "#c62828", "&:hover": { bgcolor: "#b71c1c" }, borderRadius: "8px", fontWeight: 700, boxShadow: "none" }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VistaMinisterio;
