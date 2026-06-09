import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip
} from "@mui/material";
import { MOCK_HISTORIAL, ESTADO_LABELS } from "../data/mockData";

const getField = (row, ...keys) => {
  if (!row) return "";
  for (const key of keys) {
    const found = Object.keys(row).find((k) => k.toLowerCase() === key.toLowerCase());
    if (found !== undefined) return row[found] ?? "";
  }
  return "";
};

const DetalleItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color: "#333", mt: 0.5 }}>
      {value || "—"}
    </Typography>
  </Box>
);

const DetalleEstablecimientoDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
      <DialogTitle sx={{ bgcolor: "#005596", color: "white", fontWeight: "bold" }}>
        Detalles del Establecimiento
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DetalleItem label="Nombre del Establecimiento" value={getField(data, "nombre", "NOMBRE", "Establecimiento")} />
            <DetalleItem label="Origen" value={getField(data, "origen", "ORIGEN")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            {(() => {
              const historial = MOCK_HISTORIAL[data.id] || [];
              const fechaInicio = historial.length > 0 ? new Date(historial[0].fecha).toLocaleDateString("es-AR") : "—";
              return <DetalleItem label="Fecha de inicio" value={fechaInicio} />;
            })()}
            <DetalleItem label="Fecha de Vencimiento" value={getField(data, "vencimiento", "VENCIMIENTO")} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        {(() => {
          const isAltaDigitalOrImportado = 
            (getField(data, "tipoTramite", "TIPOTRAMITE") || "").toUpperCase() === "ALTA DIGITAL" ||
            (getField(data, "origen", "ORIGEN") || "").toUpperCase() === "IMPORTADO";
            
          if (!isAltaDigitalOrImportado) {
            return (
              <Typography variant="body2" color="text.secondary">
                Más información y documentos adjuntos podrían mostrarse aquí en el futuro.
              </Typography>
            );
          }

          const historial = MOCK_HISTORIAL[data.id] || [];
          return (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#005596", mb: 2 }}>
                Historial de Estados
              </Typography>
              {historial.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Sin historial registrado.</Typography>
              ) : (
                <Stepper orientation="vertical" activeStep={historial.length} sx={{ '& .MuiStepConnector-line': { minHeight: '20px' } }}>
                  {historial.map((evento, index) => (
                    <Step key={index} expanded={true} completed={true}>
                      <StepLabel 
                        icon={
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#005596', border: '2px solid white', boxShadow: '0 0 0 2px #005596' }} />
                        }
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {ESTADO_LABELS[evento.estadoNuevo] || evento.estadoNuevo}
                        </Typography>
                      </StepLabel>
                      <StepContent sx={{ borderLeft: '2px solid #e2e8f0', ml: 1, pl: 3 }}>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "bold", display: "block" }}>
                          {new Date(evento.fecha).toLocaleDateString("es-AR")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {evento.motivo}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              )}
            </>
          );
        })()}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" } }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetalleEstablecimientoDialog;
