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
} from "@mui/icons-material";
import { useData } from "../context/DataContext";

// ─── Estado color ─────────────────────────────────────────────────────────────
const getEstadoColor = (value) => {
  const v = String(value || "").toUpperCase();
  if (v.includes("HABILITADO") && !v.includes("NO")) return "#2e7d32";
  if (v.includes("VENCIDO")) return "#d32f2f";
  if (v.includes("VENCER")) return "#f57f17";
  if (v.includes("MODIF")) return "#6a1b9a";
  if (v.includes("NO VIGENTE") || v.includes("NOVIGENTE")) return "#004582";
  return "#005596";
};

// ─── Chip de ORIGEN ───────────────────────────────────────────────────────────
const OrigenChip = ({ value }) => {
  if (!value) return <Typography variant="body2" sx={{ color: "#bbb" }}>—</Typography>;
  const v = String(value).toUpperCase();
  const palette = {
    MIGRADO: { bgcolor: "#fff3e0", color: "#e65100", border: "1px solid #ffb74d" },
    TRAMITE: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "1px solid #81c784" },
  };
  const s = palette[v] || { bgcolor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" };
  return (
    <Chip
      label={value}
      size="small"
      sx={{ fontWeight: "bold", fontSize: "0.7rem", borderRadius: "4px", ...s }}
    />
  );
};

// ─── Acciones contextuales ────────────────────────────────────────────────────
const ACCIONES_POR_ESTADO = {
  "EN PROCESO DE MODIFICACIÓN": [
    { label: "Continuar", icon: <EditIcon fontSize="small" />, color: "rgb(9, 155, 227)", primary: true },
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
  "HABILITADO": [
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)", primary: true },
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
    { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)", primary: true },
    { label: "Ver Resolución", icon: <DescriptionIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
    { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
  ],
};

const DEFAULT_ACCIONES = [
  { label: "Visualizar", icon: <VisibilityIcon fontSize="small" />, color: "rgb(254, 222, 39)", primary: true },
  { label: "Historial", icon: <HistoryIcon fontSize="small" />, color: "rgb(46, 125, 50)" },
];

const AccionesCell = ({ row, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const estado = row.estado || row.ESTADO || row.Estado || "";
  const accionesEstado = ACCIONES_POR_ESTADO[estado.toUpperCase()] || DEFAULT_ACCIONES;
  const primaryAction = accionesEstado.find((a) => a.primary);
  const secondaryActions = accionesEstado.filter((a) => !a.primary);

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
      {primaryAction && (
        <Tooltip title={primaryAction.label} arrow>
          <IconButton size="small" sx={{ color: primaryAction.color }}
            onClick={() => alert(`${primaryAction.label}: ${row.nombre || row.NOMBRE || row.id}`)}>
            {primaryAction.icon}
          </IconButton>
        </Tooltip>
      )}
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
          PaperProps={{ elevation: 3, sx: { borderRadius: "8px", minWidth: 190, mt: 0.5 } }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {secondaryActions.map((accion) => (
            <MenuItem key={accion.label}
              onClick={() => { setAnchorEl(null); alert(`${accion.label}: ${row.nombre || row.NOMBRE || row.id}`); }}
              sx={{ py: 1, fontSize: "0.875rem", "&:hover": { bgcolor: "#f8fafc" } }}>
              <ListItemIcon sx={{ color: accion.color, minWidth: 32 }}>{accion.icon}</ListItemIcon>
              <ListItemText primary={accion.label} />
            </MenuItem>
          ))}
          <MenuItem
            onClick={() => { setAnchorEl(null); onDelete(row); }}
            sx={{ py: 1, fontSize: "0.875rem", color: "#c62828", "&:hover": { bgcolor: "#fff5f5" } }}
          >
            <ListItemIcon sx={{ color: "#c62828", minWidth: 32 }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Eliminar" />
          </MenuItem>
        </Menu>
      </>
    </Stack>
  );
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
  const { establecimientos, eliminarEstablecimiento } = useData();
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
    estado: "",
    fechaDesde: "",
    fechaHasta: "",
    origen: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ nombre: "", expediente: "", cuit: "", tipologia: "", tipoTramite: "", departamento: "", localidad: "", estado: "", fechaDesde: "", fechaHasta: "", origen: "" });
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
    const estado = String(getField(est, "estado", "ESTADO", "Estado"));
    const origen = String(getField(est, "origen", "ORIGEN", "Origen")).toUpperCase();

    if (filters.nombre && !nombre.includes(filters.nombre.toLowerCase())) return false;
    if (filters.expediente && !expediente.includes(filters.expediente.toLowerCase())) return false;
    if (filters.cuit && !cuit.includes(filters.cuit.toLowerCase())) return false;
    if (filters.tipologia && tipologia !== filters.tipologia) return false;
    if (filters.tipoTramite && tipoTramite !== filters.tipoTramite) return false;
    if (filters.departamento && departamento !== filters.departamento) return false;
    if (filters.localidad && !localidad.includes(filters.localidad.toLowerCase())) return false;
    if (filters.estado && estado !== filters.estado) return false;
    if (filters.origen && origen !== filters.origen.toUpperCase()) return false;
    return true;
  });

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      {/* === FILTROS === */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1, p: 2 }}>
          Bandeja de Establecimientos
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
            <TextField fullWidth variant="standard" select label="Estado" name="estado"
              value={filters.estado} onChange={handleFilterChange}>
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="EN PROCESO DE MODIFICACIÓN">En Proceso de Modificación</MenuItem>
              <MenuItem value="HABILITADO">Habilitado</MenuItem>
              <MenuItem value="PRÓXIMO A VENCER">Próximo a Vencer</MenuItem>
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

          {/* Fila 3: Tipo de Trámite · Departamento · Localidad · Origen */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px 32px" }}>
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
              <MenuItem value="Tercero Arriba">Tercero Arriba</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" label="Localidad" name="localidad"
              value={filters.localidad} onChange={handleFilterChange} placeholder="Ej: Córdoba" />
            <TextField fullWidth variant="standard" select label="Origen" name="origen"
              value={filters.origen} onChange={handleFilterChange}>
              <MenuItem value="">Todos los orígenes</MenuItem>
              <MenuItem value="TRAMITE">Trámite</MenuItem>
              <MenuItem value="MIGRADO">Migrado</MenuItem>
            </TextField>
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

      {/* === TABLA === */}
      <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }} size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: "#005596" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ORIGEN</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TIPOLOGÍA</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>EXPEDIENTE</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>CUIT</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>DEPARTAMENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>LOCALIDAD</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TITULARIDAD</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                const estadoVal = getField(row, "estado", "ESTADO", "Estado");
                const estadoColor = row.color || getEstadoColor(estadoVal);
                const origenVal = getField(row, "origen", "ORIGEN", "Origen");
                return (
                  <TableRow key={row.id ?? idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <OrigenChip value={origenVal} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "tipologia", "TIPOLOGÍA", "Tipologia", "TIPOLOGIA") || "—"}
                      </Typography>
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
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "departamento", "DEPARTAMENTO", "Departamento") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "localidad", "LOCALIDAD", "Localidad", "ubicacion", "UBICACION", "Ubicacion", "Ubicación", "UBICACIÓN") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#333" }}>
                        {getField(row, "titularidad", "TITULARIDAD", "Titularidad") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoVal || "—"}
                        size="small"
                        sx={{
                          fontWeight: "bold", fontSize: "0.7rem",
                          bgcolor: `${estadoColor}15`, color: estadoColor,
                          borderRadius: "4px", border: `1px solid ${estadoColor}30`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <AccionesCell row={row} onDelete={(r) => setConfirmDelete(r)} />
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
