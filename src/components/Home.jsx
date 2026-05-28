import React from "react";
import { Box, Card, CardActionArea, CardContent, Typography, Avatar, Grid, Container } from "@mui/material";
import { 
  Store as StoreIcon, 
  Assignment as AssignmentIcon, 
  FolderOpen as FolderIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const CARDS_BY_ROLE = {
  efector: [
    { title: "Mis establecimientos", description: "Gestioná tus establecimientos habilitados.", icon: <StoreIcon sx={{ fontSize: 40 }} />, path: "bandeja" },
    { title: "Trámites en curso", description: "Consultá el estado de tus trámites iniciados.", icon: <AssignmentIcon sx={{ fontSize: 40 }} />, path: "tramites" }
  ],
  agente: [
    { title: "Expedientes abiertos", description: "Revisá los expedientes pendientes de auditoría.", icon: <FolderIcon sx={{ fontSize: 40 }} />, path: "expedientes" },
    { title: "Consulta trámites", description: "Buscá trámites específicos en el sistema.", icon: <AssignmentIcon sx={{ fontSize: 40 }} />, path: "tramites" },
    { title: "Consulta establecimientos", description: "Accedé al listado completo de establecimientos.", icon: <StoreIcon sx={{ fontSize: 40 }} />, path: "bandeja" }
  ],
  ministerio: [
    { title: "Establecimientos", description: "Consultá todos los establecimientos de la provincia.", icon: <StoreIcon sx={{ fontSize: 40 }} />, path: "bandeja" }
  ],
  consultor: [
    { title: "Establecimiento", description: "Consultá información pública de un establecimiento.", icon: <SearchIcon sx={{ fontSize: 40 }} />, path: "bandeja" }
  ]
};

const Home = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();

  const cards = CARDS_BY_ROLE[roleId] || [];

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        bgcolor: "transparent",
        overflow: "hidden",
        p: 3
      }}
    >
      <Container maxWidth="lg" sx={{ zIndex: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {cards.map((card, index) => (
            <Card 
              key={index} 
              sx={{ 
                width: 320,
                height: 300,
                borderRadius: 4, 
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)", 
                transition: "transform 0.2s", 
                "&:hover": { transform: "translateY(-4px)" },
                display: "flex",
                flexDirection: "column"
              }}
            >
              <CardActionArea 
                onClick={() => navigate(`/${roleId}/${card.path}`)} 
                sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, justifyContent: "center" }}
              >
                <Avatar sx={{ width: 80, height: 80, bgcolor: "#00b0f0", mb: 3 }}>
                  {card.icon}
                </Avatar>
                <CardContent sx={{ p: 0, textAlign: "center" }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 800, color: "#153376", lineHeight: 1.2 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
