import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  Divider
} from "@mui/material";
import {
  Home as HomeIcon,
  ListAlt as ListIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  AccountTree as AccountTreeIcon,
} from "@mui/icons-material";
import { useRole } from "../context/RoleContext";
import fondoApp from "../assets/fondo.jpg";

const drawerWidth = 60; // Mini drawer width

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roleId } = useParams();
  const { role, currentRole, changeRole, ROLES } = useRole();
  const [avatarAnchor, setAvatarAnchor] = useState(null);

  // Sync URL param with context
  useEffect(() => {
    if (roleId && roleId !== role) {
      const isValidRole = ROLES.some(r => r.id === roleId);
      if (isValidRole) {
        changeRole(roleId);
      } else {
        navigate("/");
      }
    }
  }, [roleId, role, ROLES, changeRole, navigate]);

  const handleRoleSelect = (newRoleId) => {
    setAvatarAnchor(null);
    changeRole(newRoleId);
    // Determine current sub-path (home or bandeja)
    const currentSubPath = location.pathname.split("/")[2] || "home";
    navigate(`/${newRoleId}/${currentSubPath}`);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      backgroundImage: `url(${fondoApp})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#153376", // Right side background (dark blue)
          display: "flex",
          flexDirection: "row"
        }}
      >
        {/* Left header area (Cyan) */}
        <Box sx={{
          width: 320,
          bgcolor: "#00b0f0", // cyan from screenshot
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.5
        }}>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: "block", lineHeight: 1, letterSpacing: 1 }}>
              MINISTERIO DE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
              SALUD <span style={{ fontWeight: 400, fontSize: "0.8em" }}>Clic Salud</span>
            </Typography>
          </Box>
        </Box>

        {/* Right header area (Dark Blue) */}
        <Toolbar sx={{ flexGrow: 1, justifyContent: "flex-end", minHeight: "60px", gap: 2 }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "white", textTransform: "uppercase" }}>
              MARIA AZUL TALAVERA
            </Typography>
            
            <IconButton color="inherit" sx={{ p: 0.5 }}>
              <PersonIcon sx={{ border: "2px solid white", borderRadius: "50%", p: 0.2 }} />
            </IconButton>

            <IconButton color="inherit" sx={{ p: 0.5 }}>
              <NotificationsIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2, borderLeft: "1px solid rgba(255,255,255,0.3)", pl: 2 }}>
              <Tooltip title="Cambiar perfil (Mockup)">
                <Avatar
                  onClick={(e) => setAvatarAnchor(e.currentTarget)}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: currentRole.color,
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    border: "2px solid rgba(255,255,255,0.6)",
                  }}
                >
                  {currentRole.avatar}
                </Avatar>
              </Tooltip>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ── ROLE MENU ──────────────────────────────────────────────────────── */}
      <Menu
        anchorEl={avatarAnchor}
        open={Boolean(avatarAnchor)}
        onClose={() => setAvatarAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ elevation: 4, sx: { borderRadius: "12px", minWidth: 240, mt: 1 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Cambiar perfil
          </Typography>
        </Box>
        <Divider />
        {ROLES.map((r) => {
          const isActive = role === r.id;
          return (
            <MenuItem key={r.id} onClick={() => handleRoleSelect(r.id)} sx={{ py: 1.25, px: 2, bgcolor: isActive ? `${r.color}08` : "transparent" }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: isActive ? r.color : "#e2e8f0", color: isActive ? "white" : "#94a3b8", fontSize: "0.75rem", fontWeight: 800 }}>
                  {r.avatar}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 500, color: isActive ? r.color : "#334155" }}>{r.label}</Typography>}
                secondary={<Typography variant="caption" sx={{ color: "#94a3b8" }}>{r.description}</Typography>}
              />
              {isActive && <CheckIcon sx={{ color: r.color, fontSize: 18, ml: 1 }} />}
            </MenuItem>
          );
        })}
      </Menu>

      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px" }}>
        {/* ── SIDEBAR (Drawer) ──────────────────────────────────────────────── */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
              bgcolor: "#f5f5f5",
              mt: "64px"
            },
          }}
        >
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{ minHeight: 48, justifyContent: "center", px: 2.5 }}
                onClick={() => navigate(`/${roleId}/home`)}
                selected={location.pathname === `/${roleId}/home` || location.pathname === `/${roleId}`}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: "auto", justifyContent: "center", color: (location.pathname === `/${roleId}/home` || location.pathname === `/${roleId}`) ? "#00b0f0" : "#555" }}>
                  <HomeIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{ minHeight: 48, justifyContent: "center", px: 2.5 }}
                onClick={() => navigate(`/${roleId}/bandeja`)}
                selected={location.pathname === `/${roleId}/bandeja`}
              >
                <Tooltip title="Bandeja" placement="right" arrow>
                  <ListItemIcon sx={{ minWidth: 0, mr: "auto", justifyContent: "center", color: location.pathname === `/${roleId}/bandeja` ? "#00b0f0" : "#555" }}>
                    <ListIcon />
                  </ListItemIcon>
                </Tooltip>
              </ListItemButton>
            </ListItem>
            {roleId === "ministerio" && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{ minHeight: 48, justifyContent: "center", px: 2.5 }}
                  onClick={() => navigate(`/${roleId}/simulador`)}
                  selected={location.pathname === `/${roleId}/simulador`}
                >
                  <Tooltip title="Simulador DTE" placement="right" arrow>
                    <ListItemIcon sx={{ minWidth: 0, mr: "auto", justifyContent: "center", color: location.pathname === `/${roleId}/simulador` ? "#00b0f0" : "#555" }}>
                      <AccountTreeIcon />
                    </ListItemIcon>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Drawer>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px - 40px)", // height - header - footer
            mb: "40px" // space for footer
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          bgcolor: "#005596",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          zIndex: (theme) => theme.zIndex.drawer + 2, // on top of drawer
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
           <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>Córdoba</Typography>
           <Typography variant="caption" sx={{ opacity: 0.8 }}>GOBIERNO DE LA PROVINCIA</Typography>
           <Typography variant="caption" sx={{ ml: 2, fontWeight: 700, fontStyle: "italic", opacity: 0.9 }}>Hacer para crecer</Typography>
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          Versión 2.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
