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
    if (role === "efector") return <VistaEfector />;
    if (role === "consultor") return <VistaConsultor />;
    if (role === "ministerio" || role === "administrador") return <VistaMinisterio />;
    return <VistaAgente />;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, bgcolor: "transparent" }}>

      {/* Main View */}
      {renderView()}

      {role === "ministerio" && (
        <ImportarExcel open={importOpen} onClose={() => setImportOpen(false)} role={role} />
      )}
    </Box>
  );
};

export default Bandeja;
