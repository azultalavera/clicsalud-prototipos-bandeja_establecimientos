import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutlined as ErrorOutlineIcon,
  Close as CloseIcon,
  DeleteSweep as DeleteSweepIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useData } from "../context/DataContext";

const ImportarExcel = ({ open, onClose, role }) => {
  const { importarDesdeExcel, agregarDesdeExcel, establecimientos } = useData();
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const resetState = () => {
    setFile(null);
    setRows([]);
    setColumns([]);
    setError(null);
    setSuccess(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const parseFile = useCallback((f) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
        });

        if (json.length === 0) {
          setError("El archivo no contiene datos o está vacío.");
          setLoading(false);
          return;
        }

        const cols = Object.keys(json[0]);
        setColumns(cols);
        setRows(json);
        setFile(f);
      } catch (err) {
        setError("No se pudo leer el archivo. Asegurate de que sea un .xlsx o .xls válido.");
      }
      setLoading(false);
    };
    reader.readAsArrayBuffer(f);
  }, []);

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) parseFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) parseFile(f);
  };

  // Si el perfil es "ministerio", inyecta origen: "MIGRADO" en cada fila
  const applyOrigen = (rawRows) => {
    if (role === "ministerio") {
      return rawRows.map((r) => ({ ...r, origen: "MIGRADO" }));
    }
    return rawRows;
  };

  const handleReemplazar = () => {
    importarDesdeExcel(applyOrigen(rows));
    setSuccess(`Se importaron ${rows.length} establecimientos correctamente (datos anteriores reemplazados).`);
    setRows([]);
    setColumns([]);
    setFile(null);
  };

  const handleAgregar = () => {
    agregarDesdeExcel(applyOrigen(rows));
    setSuccess(`Se agregaron ${rows.length} establecimientos a los ${establecimientos.length} existentes.`);
    setRows([]);
    setColumns([]);
    setFile(null);
  };

  const previewRows = rows.slice(0, 5);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { borderRadius: "16px", maxHeight: "90vh" } }}>
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#005596" }}>
            Importar Establecimientos desde Excel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleccioná un archivo .xlsx o .xls — las columnas se detectan automáticamente
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        {/* Drop Zone */}
        {!file && !success && (
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${dragOver ? "#005596" : "#cbd5e1"}`,
              borderRadius: "12px",
              p: 5,
              textAlign: "center",
              bgcolor: dragOver ? "#f0f7ff" : "#fafafa",
              transition: "all 0.2s",
              cursor: "pointer",
              mb: 3,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 56, color: dragOver ? "#005596" : "#94a3b8", mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}>
              Arrastrá el archivo acá
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              o hacé clic para seleccionar desde tu computadora
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" }, borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
            >
              Seleccionar archivo Excel
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileInput} />
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1.5 }}>
              Formatos aceptados: .xlsx, .xls
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        {/* Success */}
        {success && (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: "8px" }}>
            {success}
          </Alert>
        )}

        {/* Preview table */}
        {rows.length > 0 && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Vista previa — {file?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rows.length} filas detectadas · {columns.length} columnas · Mostrando las primeras 5
                  {role === "ministerio" && (
                    <Box component="span" sx={{ ml: 1, fontWeight: 700, color: "#e65100" }}>
                      · Se agregará columna ORIGEN = MIGRADO
                    </Box>
                  )}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {columns.map((col) => (
                  <Chip key={col} label={col} size="small" sx={{ fontSize: "0.7rem" }} />
                ))}
              </Stack>
            </Box>

            <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", mb: 2 }}>
              <TableContainer sx={{ maxHeight: 280 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((col) => (
                        <TableCell key={col} sx={{ fontWeight: 700, bgcolor: "#005596", color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewRows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        {columns.map((col) => (
                          <TableCell key={col} sx={{ fontSize: "0.8rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {String(row[col] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Warning si hay datos existentes */}
            {establecimientos.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: "8px" }}>
                Ya existen <strong>{establecimientos.length}</strong> establecimientos cargados. Podés reemplazarlos o agregar los nuevos a los existentes.
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {rows.length > 0 && (
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none", color: "#64748b" }}>
            Cancelar
          </Button>
          {establecimientos.length > 0 && (
            <Button
              onClick={handleAgregar}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#005596", color: "#005596" }}
            >
              Agregar a existentes
            </Button>
          )}
          <Button
            onClick={handleReemplazar}
            variant="contained"
            startIcon={<DeleteSweepIcon />}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" } }}
          >
            {establecimientos.length > 0 ? "Reemplazar todo" : `Importar ${rows.length} registros`}
          </Button>
        </DialogActions>
      )}

      {!rows.length && !success && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>Cerrar</Button>
        </DialogActions>
      )}

      {success && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" }, borderRadius: "8px" }}>
            Aceptar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ImportarExcel;
