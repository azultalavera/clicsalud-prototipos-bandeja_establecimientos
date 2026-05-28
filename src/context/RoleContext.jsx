import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext(null);

export const ROLES = [
  {
    id: "efector",
    label: "Efector",
    color: "#005596",
    description: "Mis establecimientos habilitados",
    avatar: "E",
  },
  {
    id: "agente",
    label: "Agente",
    color: "#7b1fa2",
    description: "Bandeja de establecimientos asignados",
    avatar: "A",
  },
  {
    id: "ministerio",
    label: "Consultor Ministerio",
    color: "#e65100",
    description: "Todos los establecimientos del sistema",
    avatar: "M",
  },
  {
    id: "consultor",
    label: "Consultor Particular",
    color: "#00796b",
    description: "Consulta puntual de un establecimiento",
    avatar: "C",
  },
];

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("bandeja_role") || "efector";
  });

  const changeRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("bandeja_role", newRole);
  };

  const currentRole = ROLES.find((r) => r.id === role) || ROLES[0];

  return (
    <RoleContext.Provider value={{ role, currentRole, changeRole, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
