import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext(null);

export const ROLES = [
  {
    id: "agente_auditoria",
    label: "AGENTE AUDITOR",
    color: "#005596",
    description: "Control y auditoría",
    avatar: "AU",
  },
  {
    id: "agente_inspector",
    label: "AGENTE INSPECTOR",
    color: "#005596",
    description: "Inspecciones en terreno",
    avatar: "AI",
  },
  {
    id: "agente_protocolizador",
    label: "AGENTE PROTOCOLIZADOR",
    color: "#005596",
    description: "Protocolización",
    avatar: "AP",
  },
  {
    id: "ministerio",
    label: "AGENTE CONSULTOR",
    color: "#005596",
    description: "Consultas del ministerio",
    avatar: "CO",
  },
  {
    id: "efector",
    label: "Efector",
    color: "#005596",
    description: "Mis establecimientos habilitados",
    avatar: "E",
    hidden: true,
  },
  {
    id: "consultor",
    label: "Consultor Externo",
    color: "#00796b",
    description: "Consulta puntual de un establecimiento",
    avatar: "CE",
    hidden: true,
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
