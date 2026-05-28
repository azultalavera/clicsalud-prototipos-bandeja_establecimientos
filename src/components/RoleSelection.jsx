import React from "react";
import { Box, Card, CardActionArea, CardContent, Typography, Avatar, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import fondoApp from "../assets/fondo.jpg";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { ROLES, changeRole } = useRole();

  const handleSelectRole = (roleId) => {
    changeRole(roleId);
    navigate(`/${roleId}/home`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${fondoApp})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Semi-transparent overlay to make cards pop */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(255,255,255,0.4)" }} />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 900, color: "#153376", mb: 2, textShadow: "1px 1px 4px rgba(255,255,255,0.8)" }}>
          Bienvenido a Clic Salud
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: "#333", mb: 6, fontWeight: 600 }}>
          Seleccione el perfil para ingresar
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {ROLES.map((role) => (
            <Grid item xs={12} sm={6} md={6} key={role.id}>
              <Card sx={{ borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                <CardActionArea onClick={() => handleSelectRole(role.id)} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar sx={{ width: 72, height: 72, bgcolor: role.color, mb: 2, fontSize: "2rem", fontWeight: "bold" }}>
                    {role.avatar}
                  </Avatar>
                  <CardContent sx={{ p: 0, textAlign: "center" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 800, color: role.color }}>
                      {role.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RoleSelection;
