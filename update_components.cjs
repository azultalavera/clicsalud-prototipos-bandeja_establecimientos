const fs = require('fs');
const path = require('path');

const components = ['VistaAgente.jsx', 'VistaEfector.jsx', 'VistaMinisterio.jsx'];
const baseDir = path.join(__dirname, 'src', 'components');

const stateColorsCode = `
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
`;

const getEstadoColorRegex = /\/\/ ─── Estado chip ──────────────────────────────────────────────────────────────[\s\S]*?};\n|\/\/ ─── Estado color ─────────────────────────────────────────────────────────────[\s\S]*?};\n/;

components.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace state colors
  content = content.replace(getEstadoColorRegex, stateColorsCode);

  // 2. Update AccionesCell
  content = content.replace(
    /const estado = row\.estado \|\| row\.ESTADO \|\| row\.Estado \|\| "";/,
    'const estado = getField(row, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO") || "";'
  );

  // 3. Update filters state
  content = content.replace(
    /estado: "",/,
    'estadoTramite: "",\n    estadoEstablecimiento: "",'
  );

  // 4. Update clearFilters
  content = content.replace(
    /estado: "",/,
    'estadoTramite: "", estadoEstablecimiento: "",'
  );

  // 5. Update filteredData logic
  content = content.replace(
    /const estado = String\(getField\(est, "estado", "ESTADO", "Estado"\)\);/,
    `const estadoTramite = String(getField(est, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite"));
    const estadoEstablecimiento = String(getField(est, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO", "EstadoEstablecimiento", "estado"));`
  );

  content = content.replace(
    /if \(filters\.estado && estado !== filters\.estado\) return false;/,
    `if (filters.estadoTramite && !estadoTramite.toUpperCase().includes(filters.estadoTramite.toUpperCase())) return false;
    if (filters.estadoEstablecimiento && estadoEstablecimiento !== filters.estadoEstablecimiento) return false;`
  );

  // 6. Update the table headers
  content = content.replace(
    /<TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0\.75rem" }}>ESTADO<\/TableCell>/,
    `<TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO TRÁMITE</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.75rem" }}>ESTADO ESTAB.</TableCell>`
  );

  // 7. Update the table rows (rendering the chips)
  const cellRegex = /const estadoVal = getField\(row, "estado", "ESTADO", "Estado"\);\s+const estadoColor = row\.color \|\| getEstadoColor\(estadoVal\);/;
  const cellReplacement = `const estadoTramiteVal = getField(row, "estadoTramite", "ESTADO_TRAMITE", "EstadoTramite") || "—";
                  const estadoEstablecimientoVal = getField(row, "estadoEstablecimiento", "ESTADO_ESTABLECIMIENTO", "EstadoEstablecimiento", "estado") || "—";
                  const colorTramite = getEstadoTramiteColor(estadoTramiteVal);
                  const colorEstablecimiento = getEstadoEstablecimientoColor(estadoEstablecimientoVal);`;
  content = content.replace(cellRegex, cellReplacement);

  const chipRegex = /<TableCell>\s*<Chip\s*label={estadoVal \|\| "—"}\s*size="small"\s*sx={{\s*fontWeight: "bold", fontSize: "0\.7rem",\s*bgcolor: \`\${estadoColor}15\`,\s*color: estadoColor,\s*borderRadius: "4px", border: \`1px solid \${estadoColor}30\`,\s*}}\s*\/>\s*<\/TableCell>/m;
  const chipReplacement = `<TableCell>
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
                        <Chip
                          label={estadoEstablecimientoVal}
                          size="small"
                          sx={{
                            fontWeight: "bold", fontSize: "0.7rem",
                            bgcolor: \`\${colorEstablecimiento}15\`, color: colorEstablecimiento,
                            borderRadius: "4px", border: \`1px solid \${colorEstablecimiento}30\`,
                          }}
                        />
                      </TableCell>`;
  content = content.replace(chipRegex, chipReplacement);

  // 8. Update the filters UI
  const filterUiRegex = /<TextField fullWidth variant="standard" select label="Estado" name="estado"[\s\S]*?<\/TextField>/;
  const filterUiReplacement = `<TextField fullWidth variant="standard" label="Estado del Trámite" name="estadoTramite"
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
            </TextField>`;
  content = content.replace(filterUiRegex, filterUiReplacement);

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Update complete');
