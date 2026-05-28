import React, { useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import { useData } from "../context/DataContext";
import { useRole } from "../context/RoleContext";
import VistaMinisterio from "./VistaMinisterio";
import VistaEfector from "./VistaEfector";
import VistaAgente from "./VistaAgente";
import VistaConsultor from "./VistaConsultor";
import ImportarExcel from "./ImportarExcel";

const Bandeja = () => {
  const { role } = useRole();
  const { establecimientos, limpiarDatos } = useData();
  const [importOpen, setImportOpen] = useState(false);
  const [confirmLimpiar, setConfirmLimpiar] = useState(false);

  const handleLimpiar = () => {
    if (confirmLimpiar) {
      limpiarDatos();
      setConfirmLimpiar(false);
    } else {
      setConfirmLimpiar(true);
      setTimeout(() => setConfirmLimpiar(false), 3000);
    }
  };

  const renderView = () => {
    switch (role) {
      case "efector":
        return <VistaEfector />;
      case "agente":
        return <VistaAgente />;
      case "ministerio":
        return <VistaMinisterio />;
      case "consultor":
        return <VistaConsultor />;
      default:
        return <VistaEfector />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, bgcolor: "transparent" }}>
      {/* Local Toolbar for Ministerio */}
      {role === "ministerio" && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}>
          {establecimientos.length > 0 && (
            <Tooltip title={confirmLimpiar ? "Hacé clic de nuevo para confirmar" : "Borrar todos los datos"}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleLimpiar}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "white" }}
              >
                {confirmLimpiar ? "¿Confirmar?" : `Borrar datos (${establecimientos.length})`}
              </Button>
            </Tooltip>
          )}
          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            onClick={() => setImportOpen(true)}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#005596" }}
          >
            Importar Excel
          </Button>
        </Box>
      )}

      {/* Main View */}
      {renderView()}

      {role === "ministerio" && (
        <ImportarExcel open={importOpen} onClose={() => setImportOpen(false)} role={role} />
      )}
    </Box>
  );
};

export default Bandeja;
