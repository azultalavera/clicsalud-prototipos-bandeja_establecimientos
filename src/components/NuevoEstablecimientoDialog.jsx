import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

const NuevoEstablecimientoDialog = ({ open, onClose, onSave }) => {
  const generarExpediente = () => `EX-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(7, "0")}-GDE`;

  const [formData, setFormData] = useState({
    nombre: "",
    expediente: generarExpediente(),
    cuit: "",
    tipologia: "",
    tipoTramite: "Habilitacion",
    estadoTramite: "BorradorArquitectura",
    estadoEstablecimiento: "NO HABILITADO",
    departamento: "",
    localidad: "",
    titularidad: "",
  });

  // Cada vez que se abre el diálogo, reiniciamos el formulario y generamos un nuevo expediente
  React.useEffect(() => {
    if (open) {
      setFormData({
        nombre: "",
        expediente: generarExpediente(),
        cuit: "",
        tipologia: "",
        tipoTramite: "Habilitacion",
        estadoTramite: "BorradorArquitectura",
        estadoEstablecimiento: "NO HABILITADO",
        departamento: "",
        localidad: "",
        titularidad: "",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave({
      ...formData,
      origen: "TRÁMITE CLICSALUD", // Fijo por requerimiento
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "#005596" }}>
        Nuevo Establecimiento
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            label="N° Expediente"
            name="expediente"
            value={formData.expediente}
            onChange={handleChange}
            placeholder="EX-2026-0000000-GDE"
          />
          <TextField
            fullWidth
            label="CUIT"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            placeholder="30-12345678-9"
          />
          
          <TextField
            select
            fullWidth
            label="Tipología"
            name="tipologia"
            value={formData.tipologia}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
          >
            <MenuItem value="CLÍNICAS, SANATORIOS y HOSPITALES">Clínicas, Sanatorios y Hospitales</MenuItem>
            <MenuItem value="ESTABLECIMIENTOS GERIÁTRICOS">Establecimientos Geriátricos</MenuItem>
            <MenuItem value="CENTRO DE SALUD AMBULATORIO">Centro de Salud Ambulatorio</MenuItem>
            <MenuItem value="CENTRO DE CIRUGÍA AMBULATORIA">Centro de Cirugía Ambulatoria</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Tipo de Trámite"
            name="tipoTramite"
            value={formData.tipoTramite}
            onChange={handleChange}
          >
            <MenuItem value="Habilitacion">Habilitación</MenuItem>
            <MenuItem value="Renovacion">Renovación</MenuItem>
            <MenuItem value="Modificacion">Modificación</MenuItem>
            <MenuItem value="Alta Digital">Alta Digital</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Estado del Establecimiento"
            name="estadoEstablecimiento"
            value={formData.estadoEstablecimiento}
            onChange={handleChange}
          >
            <MenuItem value="HABILITADO">Habilitado</MenuItem>
            <MenuItem value="NO HABILITADO">No Habilitado</MenuItem>
            <MenuItem value="PRÓXIMO A VENCER">Próximo a Vencer</MenuItem>
            <MenuItem value="VENCIDO">Vencido</MenuItem>
            <MenuItem value="EN PROCESO RENOVACIÓN">En Proceso Renovación</MenuItem>
            <MenuItem value="EN PROCESO MODIFICACIÓN">En Proceso Modificación</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Estado del Trámite"
            name="estadoTramite"
            value={formData.estadoTramite}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            helperText="Ej: BorradorArquitectura, EnAnalisisArquitectura, etc."
          />

          <TextField
            fullWidth
            label="Titularidad"
            name="titularidad"
            value={formData.titularidad}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ bgcolor: "#005596" }}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NuevoEstablecimientoDialog;
