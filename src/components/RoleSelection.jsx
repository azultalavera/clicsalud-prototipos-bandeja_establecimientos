import React from "react";
import { Box, Card, CardActionArea, CardContent, Typography, Avatar, Container, Grid, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
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

  const mainRoles = ROLES.filter(r => !r.hidden);
  const externalRoles = ROLES.filter(r => r.hidden);

  const [openModal, setOpenModal] = React.useState(false);

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

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 900, color: "#153376", mb: 2, textShadow: "1px 1px 4px rgba(255,255,255,0.8)" }}>
          Bienvenido a Clic Salud
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: "#333", mb: 6, fontWeight: 600 }}>
          Seleccione el perfil para ingresar
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 900, mx: "auto" }}>
          {mainRoles.map((role) => (
            <Grid item xs={12} sm={4} md={3} key={role.id}>
              <Card sx={{ aspectRatio: "1 / 1", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                <CardActionArea onClick={() => handleSelectRole(role.id)} sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: role.color, mb: 2, fontSize: "1.75rem", fontWeight: "bold" }}>
                    {role.avatar}
                  </Avatar>
                  <CardContent sx={{ p: 0, textAlign: "center", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "flex-start" }}>
                    <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 800, color: role.color, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.2 }}>
                      {role.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ bgcolor: "#005596", "&:hover": { bgcolor: "#003b6b" }, borderRadius: "8px", px: 4, py: 1.5, fontWeight: "bold", textTransform: "none" }}>
            Ingreso Efectores y Consultores Externos
          </Button>
        </Box>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
          <DialogTitle sx={{ fontWeight: 800, color: "#153376", textAlign: "center", pb: 1 }}>Otros Accesos</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {externalRoles.map((role) => (
                <Grid item xs={12} sm={6} key={role.id}>
                  <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #e0e0e0", boxShadow: "none", transition: "all 0.2s", "&:hover": { borderColor: role.color, bgcolor: `${role.color}0a` } }}>
                    <CardActionArea onClick={() => handleSelectRole(role.id)} sx={{ height: "100%", p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: role.color, mb: 2, fontSize: "1.5rem", fontWeight: "bold" }}>
                        {role.avatar}
                      </Avatar>
                      <CardContent sx={{ p: 0, textAlign: "center", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 800, color: role.color }}>
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
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default RoleSelection;
