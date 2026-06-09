const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'VistaEfector.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add Tabs and Tab imports
if (!content.includes('Tabs,')) {
  content = content.replace(/TablePagination,/, 'TablePagination,\n  Tabs,\n  Tab,\n  Card,\n  CardContent,\n  CardHeader,');
}

// Add state for active tab
if (!content.includes('const [activeTab, setActiveTab] = useState(0);')) {
  content = content.replace(/const \[viewData, setViewData\] = useState\(null\);/, 'const [viewData, setViewData] = useState(null);\n  const [activeTab, setActiveTab] = useState(0);');
}

// Replace the return statement to wrap in tabs
const returnRegex = /return \(\s*<Box sx=\{\{ maxWidth: "1600px", mx: "auto" \}\}>\s*({\/\* === FILTROS === \*\/}[\s\S]*?){\/\* === DIÁLOGO DETALLE ESTABLECIMIENTO === \*\/}/;
const replacement = `return (
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            "& .MuiTab-root": { fontWeight: "bold", textTransform: "none", fontSize: "0.95rem" },
            "& .Mui-selected": { color: "#005596" },
            "& .MuiTabs-indicator": { backgroundColor: "#005596", height: "3px" }
          }}
        >
          <Tab label="MIS ESTABLECIMIENTOS" />
          <Tab label="TRÁMITES EN CURSO" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          $1
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <Box sx={{ bgcolor: "#005596", color: "white", py: 2, px: 3, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Trámites en curso</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {filteredData.map((row, idx) => {
                const estadoTramiteVal = getField(row, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite") || "—";
                const colorTramite = getEstadoTramiteColor(estadoTramiteVal);
                
                return (
                  <Card key={row.id ?? idx} variant="outlined" sx={{ mb: 3, borderRadius: "12px", borderLeft: \`6px solid \${colorTramite}\`, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, borderBottom: "1px solid #eee" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AssignmentIcon sx={{ fontSize: 40, color: "#555" }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#333", textTransform: "uppercase" }}>
                          HABILITACIÓN
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary">Estado del trámite:</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333", textTransform: "uppercase" }}>
                          {estadoTramiteVal}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="caption" color="text.secondary">Fecha de creación:</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          2/6/2026
                        </Typography>
                      </Box>

                      <Button variant="contained" sx={{ bgcolor: "#00a5e3", color: "white", fontWeight: "bold", textTransform: "none", borderRadius: "8px", px: 3, "&:hover": { bgcolor: "#008ac0" } }}>
                        CONTINUAR →
                      </Button>
                    </Box>
                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "#f8fafc" }}>
                              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Tipo de trámite</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Tipología</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Fecha inicio</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Fecha último cambio de estado</TableCell>
                              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Estado del trámite</TableCell>
                              <TableCell align="center" sx={{ fontWeight: "bold", color: "#555" }}>Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>HABILITACIÓN</TableCell>
                              <TableCell>{getField(row, "tipologia", "TIPOLOGÍA", "Tipologia", "TIPOLOGIA") || "—"}</TableCell>
                              <TableCell>2/6/2026</TableCell>
                              <TableCell>2/6/2026</TableCell>
                              <TableCell>
                                <Chip label={estadoTramiteVal} size="small" sx={{ fontWeight: "bold", fontSize: "0.7rem", bgcolor: \`\${colorTramite}15\`, color: colorTramite, borderRadius: "12px", border: \`1px solid \${colorTramite}30\` }} />
                              </TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <IconButton size="small" sx={{ color: "#00a5e3" }}><EditIcon fontSize="small" /></IconButton>
                                  <IconButton size="small" sx={{ color: "rgb(254, 222, 39)" }} onClick={() => setViewData(row)}><VisibilityIcon fontSize="small" /></IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredData.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No se encontraron trámites en curso
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      )}

      {/* === DIÁLOGO DETALLE ESTABLECIMIENTO === */}`;

content = content.replace(returnRegex, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update Efector tabs complete');
