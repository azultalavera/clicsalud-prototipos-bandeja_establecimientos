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
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutlined as ErrorOutlineIcon,
  Close as CloseIcon,
  DeleteSweep as DeleteSweepIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useData, normalizarFilaExcel } from "../context/DataContext";

const STEPS = ['Subir Archivo', 'Resolver Conflictos', 'Confirmar Importación'];

const ImportarExcel = ({ open, onClose, role }) => {
  const { importarDesdeExcel, agregarDesdeExcel, establecimientos } = useData();
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  const [activeStep, setActiveStep] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const [unrecognizedTypologies, setUnrecognizedTypologies] = useState([]);
  const [typologyMapping, setTypologyMapping] = useState({});
  const [invalidCuits, setInvalidCuits] = useState([]);
  const [cuitMapping, setCuitMapping] = useState({});

  const resetState = () => {
    setFile(null);
    setRows([]);
    setColumns([]);
    setError(null);
    setSuccess(null);
    setLoading(false);
    setActiveStep(0);
    setTabIndex(0);
    setUnrecognizedTypologies([]);
    setTypologyMapping({});
    setInvalidCuits([]);
    setCuitMapping({});
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

        const cols = [
          "estadoEstablecimiento", "nombre", "expediente", "cuit", 
          "estadoTramite", "tipoTramite", "tipologia", 
          "localidad", "departamento", "titularidad", "vencimiento"
        ];
        setColumns(cols);

        // Buscar tipologías desconocidas
        const TIPOLOGIAS_VALIDAS = [
          "CLÍNICAS, SANATORIOS Y HOSPITALES",
          "ESTABLECIMIENTOS GERIÁTRICOS",
          "CENTRO DE SALUD AMBULATORIO",
          "CENTRO DE CIRUGÍA AMBULATORIA"
        ];
        
        const unknownTypes = new Set();
        const badCuits = new Set();
        const mappedJson = [];

        json.forEach(row => {
           // Mapeo explícito de columnas
           const mappedRow = {
             estadoEstablecimiento: row["ESTADO"] || "",
             nombre: row["NOMBRE DEL ESTABLECIMIENTO"] || "",
             expediente: row["EXPTE SOPORTE DIGITAL"] || "",
             cuit: row["CUIT"] || "",
             estadoTramite: "", // Vacío para los importados
             tipoTramite: "Alta Digital", // Valor por defecto
             tipologia: row["TIPOLOGIA"] || "",
             localidad: row["LOCALIDAD"] || "",
             departamento: row["DEPARTAMENTO"] || "",
             titularidad: row["RAZON SOCIAL"] || "",
             vencimiento: row["VENCIMIENTO"] || ""
           };

           const normRow = normalizarFilaExcel(mappedRow);
           mappedJson.push(normRow);
           
           // Tipologías
           const valTipo = String(normRow.tipologia).trim();
           if (valTipo && !TIPOLOGIAS_VALIDAS.includes(valTipo.toUpperCase())) {
             unknownTypes.add(valTipo);
           }

           // CUITs
           const valCuit = String(normRow.cuit).trim();
           if (valCuit) {
             const digits = valCuit.replace(/\D/g, "");
             if (digits.length !== 11) {
               badCuits.add(valCuit);
             }
           }
        });

        const initialMapping = {};
        unknownTypes.forEach(t => initialMapping[t] = "");
        setUnrecognizedTypologies(Array.from(unknownTypes));
        setTypologyMapping(initialMapping);

        const initialCuitMapping = {};
        badCuits.forEach(c => initialCuitMapping[c] = "");
        setInvalidCuits(Array.from(badCuits));
        setCuitMapping(initialCuitMapping);

        setRows(mappedJson);
        setFile(f);

        // Determinar siguiente paso
        if (unknownTypes.size > 0 || badCuits.size > 0) {
          setActiveStep(1);
          setTabIndex(unknownTypes.size > 0 ? 0 : 1);
        } else {
          setActiveStep(2);
        }

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

  const applyOrigenAndMapping = (rawRows) => {
    return rawRows.map((r) => {
      const mappedRow = { ...r };
      
      const tipologiaVal = String(mappedRow.tipologia).trim();
      if (tipologiaVal && typologyMapping[tipologiaVal]) {
         mappedRow.tipologia = typologyMapping[tipologiaVal];
      }

      const cuitVal = String(mappedRow.cuit).trim();
      if (cuitVal && cuitMapping[cuitVal]) {
         mappedRow.cuit = cuitMapping[cuitVal];
      }

      if (role === "ministerio") {
        mappedRow.origen = "IMPORTADO";
      }
      return mappedRow;
    });
  };

  const handleReemplazar = () => {
    importarDesdeExcel(applyOrigenAndMapping(rows));
    setSuccess(`Se importaron ${rows.length} establecimientos correctamente (datos anteriores reemplazados).`);
    setActiveStep(3); // Success step implicitly
  };

  const handleAgregar = () => {
    agregarDesdeExcel(applyOrigenAndMapping(rows));
    setSuccess(`Se procesaron ${rows.length} establecimientos. Se agregaron los nuevos y se actualizaron los ya existentes.`);
    setActiveStep(3); // Success step implicitly
  };

  const handleNextToConfirm = () => {
    setActiveStep(2);
  };

  const previewRows = rows.slice(0, 5);
  
  const hasErrors = unrecognizedTypologies.length > 0 || invalidCuits.length > 0;
  const canProceedToConfirm = 
    !unrecognizedTypologies.some(t => !typologyMapping[t]) && 
    !invalidCuits.some(c => (cuitMapping[c] || "").replace(/\D/g,"").length !== 11);

  const duplicates = React.useMemo(() => {
     if (activeStep !== 2) return [];
     const mappedRows = applyOrigenAndMapping(rows);
     return mappedRows.filter(r => {
       const exp = String(r.expediente || "").toLowerCase().trim();
       const nom = String(r.nombre || "").toLowerCase().trim();
       
       if (!exp && !nom) return false;

       const existing = establecimientos.find(e => {
          const eExp = String(e.expediente || "").toLowerCase().trim();
          const eNom = String(e.nombre || "").toLowerCase().trim();
          
          if (exp && eExp === exp) return true;
          if (nom && eNom === nom) return true;
          return false;
       });
       if (existing) {
          const diffs = [];
          const checkFields = ["nombre", "cuit", "tipologia", "localidad", "departamento", "titularidad", "estadoEstablecimiento", "vencimiento"];
          checkFields.forEach(f => {
             const oldVal = String(existing[f] || "").trim();
             const newVal = String(r[f] || "").trim();
             if (oldVal !== newVal) {
                diffs.push({ field: f, old: oldVal, new: newVal });
             }
          });
          r.diffs = diffs;
          return true;
       }
       return false;
     });
  }, [activeStep, rows, establecimientos, typologyMapping, cuitMapping]);

  const duplicatesConCambios = duplicates.filter(d => d.diffs && d.diffs.length > 0);
  const duplicatesSinCambios = duplicates.filter(d => !d.diffs || d.diffs.length === 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { borderRadius: "16px", maxHeight: "90vh", minHeight: "60vh" } }}>
      
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#005596" }}>
            Importar Establecimientos desde Excel
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column' }}>
        
        {!success && (
          <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
            {STEPS.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              // Skip mark if no errors and we skipped step 1
              if (index === 1 && !hasErrors && activeStep === 2) {
                stepProps.completed = true;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>
                    <Typography sx={{ fontWeight: activeStep === index ? 700 : 500 }}>{label}</Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}

        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        {/* STEP 0: Upload */}
        {activeStep === 0 && !success && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              sx={{
                border: `2px dashed ${dragOver ? "#005596" : "#cbd5e1"}`,
                borderRadius: "12px",
                p: 4,
                textAlign: "center",
                bgcolor: dragOver ? "#f0f7ff" : "#fafafa",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: dragOver ? "#005596" : "#94a3b8", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}>
                Arrastrá el archivo acá
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                .xlsx, .xls
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
            </Box>
            
            {error && (
              <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mt: 3, borderRadius: "8px" }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        {/* STEP 1: Error Resolution */}
        {activeStep === 1 && (
          <Box sx={{ flex: 1 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: "8px" }}>
              Resolvé los conflictos para continuar.
            </Alert>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} textColor="primary" indicatorColor="primary">
                {unrecognizedTypologies.length > 0 && (
                   <Tab label={`Tipologías Desconocidas (${unrecognizedTypologies.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                )}
                {invalidCuits.length > 0 && (
                   <Tab label={`CUITs Inválidos (${invalidCuits.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                )}
              </Tabs>
            </Box>

            {/* Content for Tipologías */}
            {unrecognizedTypologies.length > 0 && tabIndex === 0 && (
              <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: "8px", border: "1px solid #ffb74d" }}>
                <Typography variant="subtitle2" sx={{ color: "#b23c00", mb: 1 }}>
                  Asigná la tipología correcta:
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#ffb74d", borderRadius: "3px" } }}>
                  <Stack spacing={1.5}>
                    {unrecognizedTypologies.map(tipo => (
                      <Box key={tipo} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: "rgba(255,255,255,0.6)", p: 1.5, borderRadius: "6px" }}>
                        <Chip label={`"${tipo}"`} sx={{ fontWeight: 'bold', bgcolor: 'rgba(230, 81, 0, 0.1)', color: '#e65100', borderRadius: '6px', minWidth: 120, flexShrink: 0 }} />
                        <ArrowForwardIcon sx={{ color: "#ffb74d", fontSize: 20, flexShrink: 0 }} />
                        <TextField
                          select
                          size="small"
                          fullWidth
                          value={typologyMapping[tipo]}
                          onChange={(e) => setTypologyMapping({...typologyMapping, [tipo]: e.target.value})}
                          sx={{ bgcolor: 'white', "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
                          error={!typologyMapping[tipo]}
                          displayEmpty
                        >
                          <MenuItem value="" disabled sx={{ color: "#999", fontStyle: "italic" }}>Elegí la tipología correcta...</MenuItem>
                          <MenuItem value="CLÍNICAS, SANATORIOS y HOSPITALES">Clínicas, Sanatorios y Hospitales</MenuItem>
                          <MenuItem value="ESTABLECIMIENTOS GERIÁTRICOS">Establecimientos Geriátricos</MenuItem>
                          <MenuItem value="CENTRO DE SALUD AMBULATORIO">Centro de Salud Ambulatorio</MenuItem>
                          <MenuItem value="CENTRO DE CIRUGÍA AMBULATORIA">Centro de Cirugía Ambulatoria</MenuItem>
                        </TextField>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}

            {/* Content for CUITs */}
            {invalidCuits.length > 0 && ((unrecognizedTypologies.length > 0 && tabIndex === 1) || (unrecognizedTypologies.length === 0 && tabIndex === 0)) && (
              <Box sx={{ p: 2, bgcolor: "#ffebee", borderRadius: "8px", border: "1px solid #ef9a9a" }}>
                <Typography variant="subtitle2" sx={{ color: "#b71c1c", mb: 1 }}>
                  Corregí los CUITs (11 dígitos):
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#ef9a9a", borderRadius: "3px" } }}>
                  <Stack spacing={1.5}>
                    {invalidCuits.map(cuit => {
                      const mappedVal = cuitMapping[cuit] || "";
                      const isValid = mappedVal.replace(/\D/g, "").length === 11;
                      return (
                        <Box key={cuit} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: "rgba(255,255,255,0.6)", p: 1.5, borderRadius: "6px" }}>
                          <Chip label={`"${cuit}"`} sx={{ fontWeight: 'bold', bgcolor: 'rgba(198, 40, 40, 0.1)', color: '#c62828', borderRadius: '6px', minWidth: 120, flexShrink: 0 }} />
                          <ArrowForwardIcon sx={{ color: "#ef9a9a", fontSize: 20, flexShrink: 0 }} />
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Ej: 30-12345678-9"
                            value={cuitMapping[cuit]}
                            onChange={(e) => setCuitMapping({...cuitMapping, [cuit]: e.target.value})}
                            sx={{ bgcolor: 'white', "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
                            error={mappedVal.length > 0 && !isValid}
                            helperText={mappedVal.length > 0 && !isValid ? "Debe tener 11 dígitos" : ""}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* STEP 2: Confirmation */}
        {activeStep === 2 && !success && (
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Archivo listo: {file?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rows.length} filas listas.
                {role === "ministerio" && (
                  <Box component="span" sx={{ ml: 1, fontWeight: 700, color: "#e65100" }}>
                     (Origen: IMPORTADO)
                  </Box>
                )}
              </Typography>
            </Box>

            <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", "&:before": { display: "none" }, mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f8fafc", borderRadius: "8px", minHeight: "40px", ".MuiAccordionSummary-content": { my: 1 } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#475569" }}>
                  Vista previa (5 filas)
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
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
                          {columns.map((col) => {
                             let displayVal = String(row[col] ?? "");
                             if (col === "tipologia" && typologyMapping[displayVal]) {
                               displayVal = typologyMapping[displayVal];
                             } else if (col === "cuit" && cuitMapping[displayVal]) {
                               displayVal = cuitMapping[displayVal];
                             }
                             return (
                               <TableCell key={col} sx={{ fontSize: "0.8rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                 {displayVal}
                               </TableCell>
                             );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            {establecimientos.length > 0 && (
              <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", p: 3, mt: 4, bgcolor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}>
                  Resumen de la importación
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 4 }}>
                  {/* Left Side: Metrics */}
                  <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', minWidth: { md: '300px' } }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                        <ErrorOutlineIcon sx={{ color: "#ed6c02", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>Se encontraron</Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", my: 0.5 }}>
                        {duplicates.length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>duplicados</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mb: 1, height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Sin cambios
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", my: 0.5 }}>
                        {duplicatesSinCambios.length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>establecimientos</Typography>
                    </Box>
                  </Box>

                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                  <Divider sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }} />

                  {/* Right Side: Details */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#334155", mb: 2 }}>
                        Detalle de duplicados ({duplicatesConCambios.length})
                      </Typography>
                      
                      {duplicatesConCambios.length > 0 ? (
                        <Box sx={{ maxHeight: 200, overflowY: "auto", pr: 1, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#cbd5e1", borderRadius: "3px" } }}>
                          <Stack spacing={1}>
                            {duplicatesConCambios.map((d, i) => (
                              <Box key={i} sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 700 }}>
                                  • {d.nombre || "Sin nombre"} (Exp: {d.expediente})
                                </Typography>
                                <Box sx={{ ml: 2, mt: 1 }}>
                                  {d.diffs.map((diff, j) => (
                                    <Typography key={j} variant="caption" display="block" sx={{ color: "#475569" }}>
                                      <span style={{ fontWeight: 600 }}>{diff.field === 'estadoEstablecimiento' ? 'Estado actual' : diff.field}:</span>{" "}
                                      <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{diff.old || "(vacío)"}</span>{" "}
                                      <span style={{ margin: "0 6px", color: "#94a3b8" }}>→</span>{" "}
                                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{diff.new || "(vacío)"}</span>
                                    </Typography>
                                  ))}
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic", p: 2, textAlign: "center" }}>
                          No hay establecimientos con datos modificados.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Footer with button explanations */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', border: "1px solid #e2e8f0" }}>
                  <Typography variant="caption" sx={{ color: '#475569', flex: 1 }}>
                    <strong style={{ color: "#1e293b" }}>Reemplazar modificados:</strong> Actualiza los duplicados con cambios y suma los nuevos.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', flex: 1 }}>
                    <strong style={{ color: "#1e293b" }}>Pisar todos los datos:</strong> Borra la base actual y deja solo lo del Excel.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Success */}
        {success && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
              ¡Importación Exitosa!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {success}
            </Typography>
          </Box>
        )}

      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1, borderTop: "1px solid #e2e8f0" }}>
          {activeStep === 0 && (
            <Button onClick={handleClose} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
              Cancelar
            </Button>
          )}

          {activeStep === 1 && (
            <>
              <Button onClick={() => { setFile(null); setActiveStep(0); }} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
                Subir otro archivo
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                onClick={handleNextToConfirm}
                disabled={!canProceedToConfirm}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" } }}
              >
                Siguiente
              </Button>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Button onClick={() => hasErrors ? setActiveStep(1) : setActiveStep(0)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
                Volver
              </Button>
              <Box sx={{ flex: 1 }} />
              {establecimientos.length > 0 && (
                <Button
                  onClick={handleAgregar}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#005596", color: "#005596", borderWidth: "2px", "&:hover": { borderWidth: "2px" } }}
                >
                  {duplicates.length > 0 ? "Reemplazar modificados" : "Agregar a existentes"}
                </Button>
              )}
              <Button
                onClick={handleReemplazar}
                variant="contained"
                startIcon={<DeleteSweepIcon />}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" } }}
              >
                {establecimientos.length > 0 ? "Pisar todo" : `Importar ${rows.length} registros`}
              </Button>
            </>
          )}
        </DialogActions>
      )}

      {success && (
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: "1px solid #e2e8f0" }}>
          <Button fullWidth onClick={handleClose} variant="contained" sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" }, borderRadius: "8px" }}>
            Aceptar y cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ImportarExcel;
