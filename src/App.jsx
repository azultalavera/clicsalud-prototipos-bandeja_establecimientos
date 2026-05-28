import React from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { DataProvider } from "./context/DataContext";
import { RoleProvider } from "./context/RoleContext";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Bandeja from "./components/Bandeja";
import RoleSelection from "./components/RoleSelection";

const theme = createTheme({
  palette: {
    primary: { main: "#005596" },
    secondary: { main: "#00796b" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/:roleId" element={<Layout />}>
              <Route path="home" element={<Home />} />
              <Route path="bandeja" element={<Bandeja />} />
              <Route path="*" element={
                <Box sx={{ p: 4, textAlign: "center", mt: 4 }}>
                  <Typography variant="h5" color="text.secondary">Esta sección se encuentra en desarrollo.</Typography>
                </Box>
              } />
            </Route>
          </Routes>
        </RoleProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
