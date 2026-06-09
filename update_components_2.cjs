const fs = require('fs');
const path = require('path');

const components = ['VistaAgente.jsx', 'VistaEfector.jsx', 'VistaMinisterio.jsx'];
const baseDir = path.join(__dirname, 'src', 'components');

// 1. Update views
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
              <MenuItem value="EN PROCESO MODIFICACIÓN">En Proceso Modificación</MenuItem>
              <MenuItem value="PRÓXIMO A VENCER">Próximo a Vencer</MenuItem>
              <MenuItem value="EN PROCESO RENOVACIÓN">En Proceso Renovación</MenuItem>
              <MenuItem value="VENCIDO">Vencido</MenuItem>
              <MenuItem value="NO VIGENTE">No Vigente</MenuItem>
            </TextField>
            <TextField fullWidth variant="standard" label="Estado Establecimiento" name="estadoEstablecimiento"
              value={filters.estadoEstablecimiento} onChange={handleFilterChange} placeholder="Ej: No Habilitado" />`;

  content = content.replace(filterUiRegex, filterUiReplacement);

  fs.writeFileSync(filePath, content, 'utf8');
});

// 2. Update mockData.js
const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
if (fs.existsSync(mockDataPath)) {
  let mockContent = fs.readFileSync(mockDataPath, 'utf8');
  
  mockContent = mockContent.replace(/estadoTramite: "ACEPTADO DOCUMENTACIÓN AUDITORIA",\s*estadoEstablecimiento: "HABILITADO",/g, 'estadoTramite: "HABILITADO",\n    estadoEstablecimiento: "NO HABILITADO",');
  mockContent = mockContent.replace(/estadoTramite: "EN ANÁLISIS AUDITORÍA",\s*estadoEstablecimiento: "EN PROCESO RENOVACIÓN",/g, 'estadoTramite: "EN PROCESO RENOVACIÓN",\n    estadoEstablecimiento: "NO HABILITADO",');
  mockContent = mockContent.replace(/estadoTramite: "ACEPTADO INSPECCIÓN",\s*estadoEstablecimiento: "PRÓXIMO A VENCER",/g, 'estadoTramite: "PRÓXIMO A VENCER",\n    estadoEstablecimiento: "NO HABILITADO",');
  mockContent = mockContent.replace(/estadoTramite: "EN ANÁLISIS ARQUITECTURA",\s*estadoEstablecimiento: "EN PROCESO MODIFICACIÓN",/g, 'estadoTramite: "EN PROCESO MODIFICACIÓN",\n    estadoEstablecimiento: "NO HABILITADO",');
  mockContent = mockContent.replace(/estadoTramite: "RESPUESTA DE EMPLAZAMIENTO",\s*estadoEstablecimiento: "VENCIDO",/g, 'estadoTramite: "VENCIDO",\n    estadoEstablecimiento: "NO HABILITADO",');

  fs.writeFileSync(mockDataPath, mockContent, 'utf8');
}

console.log('Update reverse complete');
