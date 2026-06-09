import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_ESTABLECIMIENTOS } from "../data/mockData";

const DataContext = createContext(null);

const STORAGE_KEY = "bandeja_establecimientos_data_v10";

export const normalizarFilaExcel = (row) => {
  const newRow = { ...row };
  const getClave = (posibles) => Object.keys(newRow).find(k => posibles.includes(k.toLowerCase()));

  // Normalizar Tipología (corrige errores de tipeo o valores similares)
  const tipologiaKey = getClave(["tipologia", "tipología"]);
  if (tipologiaKey && newRow[tipologiaKey]) {
    const val = String(newRow[tipologiaKey]).toLowerCase();
    if (val.includes("clinica") || val.includes("clínica") || val.includes("sanatorio") || val.includes("hospital") || val.includes("hopsitales")) {
      newRow[tipologiaKey] = "CLÍNICAS, SANATORIOS y HOSPITALES";
    } else if (val.includes("geriatrico") || val.includes("geriátrico")) {
      newRow[tipologiaKey] = "ESTABLECIMIENTOS GERIÁTRICOS";
    } else if (val.includes("ambulatorio") && !val.includes("cirugia") && !val.includes("cirugía")) {
      newRow[tipologiaKey] = "CENTRO DE SALUD AMBULATORIO";
    } else if (val.includes("cirugia") || val.includes("cirugía")) {
      newRow[tipologiaKey] = "CENTRO DE CIRUGÍA AMBULATORIA";
    }
  }

  // Normalizar CUIT (si viene sin guiones, o con formato raro, intentar dejarlo como XX-XXXXXXXX-X)
  const cuitKey = getClave(["cuit"]);
  if (cuitKey && newRow[cuitKey]) {
    let c = String(newRow[cuitKey]).replace(/\D/g, ""); // Extrae solo números
    if (c.length === 11) {
      newRow[cuitKey] = `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}`;
    } else {
      newRow[cuitKey] = String(newRow[cuitKey]).trim();
    }
  }

  return newRow;
};

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
   */
  const importarDesdeExcel = (rows) => {
    const normalized = rows.map((row, idx) => ({
      ...normalizarFilaExcel(row),
      id: idx + 1,
    }));
    setEstablecimientos(normalized);
  };

  /**
   * Append rows from Excel to existing data, updating duplicates by Expediente.
   */
  const agregarDesdeExcel = (rows) => {
    setEstablecimientos((prev) => {
      const actualizados = [...prev];
      let maxId = actualizados.reduce((max, e) => Math.max(max, parseInt(e.id) || 0), 0);

      rows.forEach((row) => {
        const normRow = normalizarFilaExcel(row);
        
        // Buscar clave "expediente" ignorando mayúsculas/minúsculas
        const getVal = (obj, keyName) => {
          const key = Object.keys(obj).find(k => k.toLowerCase() === keyName.toLowerCase());
          return key ? obj[key] : null;
        };

        const rowExp = getVal(normRow, "expediente");
        const rowNom = getVal(normRow, "nombre");

        const indexExistente = actualizados.findIndex((e) => {
          const eExp = getVal(e, "expediente");
          const eNom = getVal(e, "nombre");
          
          const matchExp = eExp && rowExp && String(eExp).trim().toLowerCase() === String(rowExp).trim().toLowerCase();
          const matchNom = eNom && rowNom && String(eNom).trim().toLowerCase() === String(rowNom).trim().toLowerCase();
          
          return matchExp || matchNom;
        });

        if (indexExistente >= 0) {
          // Merge: conservar id original, actualizar resto de datos
          actualizados[indexExistente] = { ...actualizados[indexExistente], ...normRow, id: actualizados[indexExistente].id };
        } else {
          // Agregar nuevo
          maxId++;
          actualizados.push({ ...normRow, id: maxId });
        }
      });
      return actualizados;
    });
  };

  const eliminarEstablecimiento = (id) => {
    setEstablecimientos((prev) => prev.filter((e) => String(e.id) !== String(id)));
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
