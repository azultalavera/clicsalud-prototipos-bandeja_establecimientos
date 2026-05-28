import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_ESTABLECIMIENTOS } from "../data/mockData";

const DataContext = createContext(null);

const STORAGE_KEY = "bandeja_establecimientos_data_v4";

export const DataProvider = ({ children }) => {
  const [establecimientos, setEstablecimientos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_ESTABLECIMIENTOS;
    } catch {
      return MOCK_ESTABLECIMIENTOS;
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(establecimientos));
  }, [establecimientos]);

  /**
   * Replace the entire store with rows from Excel.
   * Each row is a plain object with arbitrary keys from the spreadsheet.
   */
  const importarDesdeExcel = (rows) => {
    // Normalize: assign an id if missing
    const normalized = rows.map((row, idx) => ({
      id: idx + 1,
      ...row,
    }));
    setEstablecimientos(normalized);
  };

  /**
   * Append rows from Excel to existing data
   */
  const agregarDesdeExcel = (rows) => {
    const baseId = establecimientos.length;
    const normalized = rows.map((row, idx) => ({
      id: baseId + idx + 1,
      ...row,
    }));
    setEstablecimientos((prev) => [...prev, ...normalized]);
  };

  const eliminarEstablecimiento = (id) => {
    setEstablecimientos((prev) => prev.filter((e) => e.id !== id));
  };

  const limpiarDatos = () => {
    setEstablecimientos(MOCK_ESTABLECIMIENTOS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DataContext.Provider
      value={{ establecimientos, importarDesdeExcel, agregarDesdeExcel, limpiarDatos, eliminarEstablecimiento }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
