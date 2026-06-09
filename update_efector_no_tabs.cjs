const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'VistaEfector.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove activeTab state and effect
content = content.replace(/const \[activeTab, setActiveTab\] = useState\(.*?;\s*React\.useEffect\(\(\) => \{\s*setActiveTab\(.*?\);\s*\}, \[location\.pathname\]\);/s, '');

// 2. Add isTramites boolean
content = content.replace(/const \{ establecimientos \} = useData\(\);/, 'const isTramites = location.pathname.includes("tramites");\n  const { establecimientos } = useData();');

// 3. Remove Tabs UI and restructure the return block
// We want to keep the Filters, and then conditionally render the Table or the Cards.

// First, extract the Filters block (it's inside activeTab === 0)
// Then extract the Table block (also inside activeTab === 0)
// Then extract the Cards block (inside activeTab === 1)

// It's easier to just rebuild the return block.
const returnBlockStart = content.indexOf('return (');

// We'll replace everything after return ( ...
const headerReplacement = `
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      {/* === FILTROS === */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#005596", letterSpacing: -1, p: 2 }}>
          {isTramites ? "Trámites en curso" : titulo}
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

      {!isTramites ? (
        <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 1000 }} size="medium">
              <TableHead>
              <TableRow sx={{ bgcolor: "#005596" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTABLECIMIENTO</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>EXPEDIENTE</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>CUIT</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO ESTAB.</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO TRÁMITE</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>TIPOLOGÍA</TableCell>
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
                      <Chip
                        label={estadoEstablecimientoVal}
                        size="small"
                        sx={{
                          fontWeight: "bold", fontSize: "0.7rem",
                          bgcolor: \`\${colorEstablecimiento}15\`, color: colorEstablecimiento,
                          borderRadius: "4px", border: \`1px solid \${colorEstablecimiento}30\`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoTramiteVal}
                        size="small"
                        sx={{
                          fontWeight: "bold", fontSize: "0.7rem",
                          bgcolor: \`\${colorTramite}15\`, color: colorTramite,
                          borderRadius: "4px", border: \`1px solid \${colorTramite}30\`,
                        }}
                      />
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
      ) : (
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", p: 3 }}>
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
        </Paper>
      )}

      {/* === DIÁLOGO DETALLE ESTABLECIMIENTO === */}
      <DetalleEstablecimientoDialog open={Boolean(viewData)} data={viewData} onClose={() => setViewData(null)} />

    </Box>
  );
};

export default VistaEfector;`;

const newContent = content.substring(0, returnBlockStart) + 'return (' + headerReplacement;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Done');
