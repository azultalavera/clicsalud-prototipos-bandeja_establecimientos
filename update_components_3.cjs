const fs = require('fs');
const path = require('path');

const components = ['VistaAgente.jsx', 'VistaEfector.jsx', 'VistaMinisterio.jsx'];
const baseDir = path.join(__dirname, 'src', 'components');

components.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the filter UI sections
  const filterUiRegex = /<TextField fullWidth variant="standard" label="Estado del Trámite" name="estadoTramite"[\s\S]*?<\/TextField>\s*<TextField fullWidth variant="standard" select label="Estado Establecimiento" name="estadoEstablecimiento"[\s\S]*?<\/TextField>/;
  const filterUiReplacement = `<TextField fullWidth variant="standard" select label="Estado del Trámite" name="estadoTramite"
              value={filters.estadoTramite} onChange={handleFilterChange}>
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="HABILITADO">Habilitado</MenuItem>
              <MenuItem value="EN PROCESO DE MODIFICACIÓN">En Proceso Modificación</MenuItem>
              <MenuItem value="PRÓXIMO A VENCER">Próximo a Vencer</MenuItem>
              <MenuItem value="EN PROCESO DE RENOVACIÓN">En Proceso Renovación</MenuItem>
              <MenuItem value="VENCIDO">Vencido</MenuItem>
              <MenuItem value="NO VIGENTE">No Vigente</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" select label="Estado Establecimiento" name="estadoEstablecimiento"
              value={filters.estadoEstablecimiento} onChange={handleFilterChange}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="HABILITADO">Habilitado</MenuItem>
              <MenuItem value="NO HABILITADO">No Habilitado</MenuItem>
              <MenuItem value="NO VIGENTE">No Vigente</MenuItem>
            </TextField>`;

  content = content.replace(filterUiRegex, filterUiReplacement);

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Update filters complete');
