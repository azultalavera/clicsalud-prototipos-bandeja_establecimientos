const fs = require('fs');
const path = require('path');

const components = ['VistaAgente.jsx', 'VistaEfector.jsx', 'VistaMinisterio.jsx'];
const baseDir = path.join(__dirname, 'src', 'components');

components.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add Import
  if (!content.includes('DetalleEstablecimientoDialog')) {
    content = content.replace(
      /import \{ useData \} from "\.\.\/context\/DataContext";/,
      `import { useData } from "../context/DataContext";\nimport DetalleEstablecimientoDialog from "./DetalleEstablecimientoDialog";`
    );
  }

  // 2. Update AccionesCell signature
  content = content.replace(/const AccionesCell = \(\{ row, onDelete \}\) => \{/, 'const AccionesCell = ({ row, onDelete, onView }) => {');
  content = content.replace(/const AccionesCell = \(\{ row \}\) => \{/, 'const AccionesCell = ({ row, onView }) => {');

  // 3. Update Visualizar click handler in secondaryActions mapping
  content = content.replace(
    /onClick=\{\(\) => \{ setAnchorEl\(null\); alert\(\`\$\{accion\.label\}: \$\{row\.nombre \|\| row\.NOMBRE \|\| row\.id\}\`\); \}\}/g,
    `onClick={() => { setAnchorEl(null); if (accion.label === "Visualizar" && onView) { onView(row); } else { alert(\`\${accion.label}: \${row.nombre || row.NOMBRE || row.id}\`); } }}`
  );

  // Update Visualizar click handler in primaryAction (if any exist)
  content = content.replace(
    /onClick=\{\(\) => alert\(\`\$\{primaryAction\.label\}: \$\{row\.nombre \|\| row\.NOMBRE \|\| row\.id\}\`\)\}/g,
    `onClick={() => { if (primaryAction.label === "Visualizar" && onView) { onView(row); } else { alert(\`\${primaryAction.label}: \${row.nombre || row.NOMBRE || row.id}\`); } }}`
  );

  // 4. Update the main component to hold viewData state
  const mainCompRegex = new RegExp(`const ${file.replace('.jsx', '')} = \\(\\{.*?\\}\\) => \\{|const ${file.replace('.jsx', '')} = \\(\\) => \\{`);
  content = content.replace(
    mainCompRegex,
    (match) => `${match}\n  const [viewData, setViewData] = useState(null);`
  );

  // 5. Render DetalleEstablecimientoDialog at the end
  content = content.replace(
    /(\s*)\{?\/\* === DIÁLOGO CONFIRMACIÓN ELIMINAR === \*\/\}?|(\s*)<\/Box>\s*\);\s*};\s*export default/,
    (match, p1, p2) => {
      if (match.includes('DIÁLOGO CONFIRMACIÓN ELIMINAR')) {
        return `\n      {/* === DIÁLOGO DETALLE ESTABLECIMIENTO === */}\n      <DetalleEstablecimientoDialog open={Boolean(viewData)} data={viewData} onClose={() => setViewData(null)} />\n${match}`;
      } else {
        return `\n      {/* === DIÁLOGO DETALLE ESTABLECIMIENTO === */}\n      <DetalleEstablecimientoDialog open={Boolean(viewData)} data={viewData} onClose={() => setViewData(null)} />\n${match}`;
      }
    }
  );

  // 6. Rewrite TableHead
  const tableHeadRegex = /<TableHead>[\s\S]*?<\/TableHead>/;
  const newTableHead = `<TableHead>
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
            </TableHead>`;
  content = content.replace(tableHeadRegex, newTableHead);

  // 7. Rewrite TableBody internal Row mapping
  const tableBodyMapRegex = /return \(\s*<TableRow key=\{row\.id \?\? idx\}[\s\S]*?<\/TableRow>\s*\);/g;
  
  content = content.replace(tableBodyMapRegex, () => {
    return `return (
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
                );`;
  });

  // 8. Fix colSpan for "No se encontraron resultados" (now 9 columns)
  content = content.replace(/colSpan=\{10\}/g, 'colSpan={9}');
  content = content.replace(/colSpan=\{8\}/g, 'colSpan={9}');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Update columns and popup complete');
