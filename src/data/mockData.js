// ─── DTEs (transiciones válidas por origen) ───────────────────────────────────
export const DTE_TRAMITE = {
  // ── Etapa Arquitectura ──
  BorradorArquitectura: [
    { hacia: "PendienteEvaluacionArquitectura", label: "Enviar trámite (etapa arquitectura)" },
  ],
  PendienteEvaluacionArquitectura: [
    { hacia: "EnAnalisisArquitectura", label: "Agente visualiza el trámite" },
  ],
  EnAnalisisArquitectura: [
    { hacia: "ObservadoArquitectura", label: "Cambiar estado: Observado Arquitectura" },
    { hacia: "Adecuado", label: "Cambiar estado: Adecuado" },
    { hacia: "AdecuadoConObservaciones", label: "Cambiar estado: Adecuado con Observaciones" },
    { hacia: "RechazadoArquitectura", label: "Cambiar estado: Rechazado Arquitectura" },
  ],
  ObservadoArquitectura: [
    { hacia: "RectificadoArquitectura", label: "Efector corrige y reenvía (arquitectura)" },
  ],
  RectificadoArquitectura: [
    { hacia: "EnAnalisisArquitectura", label: "Agente retoma análisis de arquitectura" },
  ],
  Adecuado: [
    { hacia: "BorradorAuditoria", label: "Efector guarda avance en auditoria" },
    { hacia: "PendienteEvaluacionAuditoria", label: "Efector envía trámite completo (auditoria)" },
  ],
  AdecuadoConObservaciones: [
    { hacia: "BorradorAuditoria", label: "Efector guarda avance en auditoria" },
    { hacia: "PendienteEvaluacionAuditoria", label: "Efector envía trámite completo (auditoria)" },
  ],
  RechazadoArquitectura: [],

  // ── Etapa Auditoria ──
  BorradorAuditoria: [
    { hacia: "PendienteEvaluacionAuditoria", label: "Efector envía trámite completo" },
  ],
  PendienteEvaluacionAuditoria: [
    { hacia: "EnAnalisisAuditoria", label: "Agente visualiza el trámite" },
  ],
  EnAnalisisAuditoria: [
    { hacia: "ObservadoAuditoria", label: "Cambiar estado: Observado Auditoria" },
    { hacia: "RechazadoAuditoria", label: "Cambiar estado: Rechazado Auditoria" },
    { hacia: "AceptadoDocumentacionAuditoria", label: "Cambiar estado: Aceptado Documentación Auditoria" },
  ],
  ObservadoAuditoria: [
    { hacia: "RectificadoAuditoria", label: "Efector corrige y reenvía (auditoria)" },
  ],
  RectificadoAuditoria: [
    { hacia: "EnAnalisisAuditoria", label: "Agente retoma análisis de auditoria" },
  ],
  RechazadoAuditoria: [],
  AceptadoDocumentacionAuditoria: [
    { hacia: "ObservadoInspeccion", label: "Acta con observaciones → Rechazar inspección" },
    { hacia: "AceptadoInspeccion", label: "Acta sin observaciones → Aceptar inspección" },
  ],

  // ── Etapa Inspección ──
  ObservadoInspeccion: [
    { hacia: "RespuestaEmplazamiento", label: "Efector registra respuesta de emplazamiento" },
  ],
  RespuestaEmplazamiento: [
    { hacia: "AceptadoInspeccion", label: "Agente acepta respuesta de emplazamiento" },
    { hacia: "RechazadoInspeccion", label: "Cambiar estado: Rechazado Inspección" },
  ],
  AceptadoInspeccion: [
    { hacia: "EnProtocolizacion", label: "Agente emite resolución de habilitación" },
  ],
  RechazadoInspeccion: [],

  // ── Etapa Protocolización ──
  EnProtocolizacion: [
    { hacia: "Finalizado", label: "Agente protocoliza resolución de habilitación" },
  ],
  Finalizado: [],
};

export const DTE_IMPORTADO = {
  Importado: [
    { hacia: "BorradorArquitectura", label: "Se crea un trámite de alta digital" },
  ],
  BorradorArquitectura: [
    { hacia: "PendienteEvaluacionArquitectura", label: "Enviar trámite (etapa arquitectura)" },
  ],
  PendienteEvaluacionArquitectura: [
    { hacia: "EnAnalisisArquitectura", label: "Agente visualiza el trámite" },
  ],
  EnAnalisisArquitectura: [
    { hacia: "ObservadoArquitectura", label: "Cambiar estado: Observado Arquitectura" },
    { hacia: "Adecuado", label: "Cambiar estado: Adecuado" },
    { hacia: "AdecuadoConObservaciones", label: "Cambiar estado: Adecuado con Observaciones" },
    { hacia: "RechazadoArquitectura", label: "Cambiar estado: Rechazado Arquitectura" },
  ],
  ObservadoArquitectura: [
    { hacia: "RectificadoArquitectura", label: "Efector corrige y reenvía (arquitectura)" },
  ],
  RectificadoArquitectura: [
    { hacia: "EnAnalisisArquitectura", label: "Agente retoma análisis de arquitectura" },
  ],
  Adecuado: [
    { hacia: "BorradorAuditoria", label: "Efector guarda avance en auditoria" },
    { hacia: "PendienteEvaluacionAuditoria", label: "Efector envía trámite completo" },
  ],
  AdecuadoConObservaciones: [
    { hacia: "BorradorAuditoria", label: "Efector guarda avance en auditoria" },
    { hacia: "PendienteEvaluacionAuditoria", label: "Efector envía trámite completo" },
  ],
  RechazadoArquitectura: [],
  BorradorAuditoria: [
    { hacia: "PendienteEvaluacionAuditoria", label: "Efector envía trámite completo" },
  ],
  PendienteEvaluacionAuditoria: [
    { hacia: "EnAnalisisAuditoria", label: "Agente visualiza el trámite" },
  ],
  EnAnalisisAuditoria: [
    { hacia: "ObservadoAuditoria", label: "Cambiar estado: Observado Auditoria" },
    { hacia: "RechazadoAuditoria", label: "Cambiar estado: Rechazado Auditoria" },
    { hacia: "AceptadoDocumentacionAuditoria", label: "Cambiar estado: Aceptado Documentación Auditoria" },
  ],
  ObservadoAuditoria: [
    { hacia: "RectificadoAuditoria", label: "Efector corrige y reenvía (auditoria)" },
  ],
  RectificadoAuditoria: [
    { hacia: "EnAnalisisAuditoria", label: "Agente retoma análisis de auditoria" },
  ],
  RechazadoAuditoria: [],
  AceptadoDocumentacionAuditoria: [
    { hacia: "ObservadoInspeccion", label: "Acta con observaciones → Rechazar inspección" },
    { hacia: "AceptadoInspeccion", label: "Acta sin observaciones → Aceptar inspección" },
  ],
  ObservadoInspeccion: [
    { hacia: "RespuestaEmplazamiento", label: "Efector registra respuesta de emplazamiento" },
  ],
  RespuestaEmplazamiento: [
    { hacia: "AceptadoInspeccion", label: "Agente acepta respuesta de emplazamiento" },
    { hacia: "RechazadoInspeccion", label: "Cambiar estado: Rechazado Inspección" },
  ],
  AceptadoInspeccion: [
    { hacia: "EnProtocolizacion", label: "Agente emite resolución de habilitación" },
  ],
  RechazadoInspeccion: [],
  EnProtocolizacion: [
    { hacia: "Finalizado", label: "Agente protocoliza resolución de habilitación" },
  ],
  Finalizado: [],
};

// ─── Tipificación de Estados ───────────────────────────────────────────────────
export const ESTADOS_TRAMITE = {
  BORRADOR_ARQUITECTURA: "BorradorArquitectura",
  PENDIENTE_EVALUACION_ARQUITECTURA: "PendienteEvaluacionArquitectura",
  EN_ANALISIS_ARQUITECTURA: "EnAnalisisArquitectura",
  OBSERVADO_ARQUITECTURA: "ObservadoArquitectura",
  RECTIFICADO_ARQUITECTURA: "RectificadoArquitectura",
  ADECUADO: "Adecuado",
  ADECUADO_CON_OBSERVACIONES: "AdecuadoConObservaciones",
  RECHAZADO_ARQUITECTURA: "RechazadoArquitectura",
  
  BORRADOR_AUDITORIA: "BorradorAuditoria",
  PENDIENTE_EVALUACION_AUDITORIA: "PendienteEvaluacionAuditoria",
  EN_ANALISIS_AUDITORIA: "EnAnalisisAuditoria",
  OBSERVADO_AUDITORIA: "ObservadoAuditoria",
  RECTIFICADO_AUDITORIA: "RectificadoAuditoria",
  RECHAZADO_AUDITORIA: "RechazadoAuditoria",
  ACEPTADO_DOCUMENTACION_AUDITORIA: "AceptadoDocumentacionAuditoria",
  
  OBSERVADO_INSPECCION: "ObservadoInspeccion",
  RESPUESTA_EMPLAZAMIENTO: "RespuestaEmplazamiento",
  ACEPTADO_INSPECCION: "AceptadoInspeccion",
  RECHAZADO_INSPECCION: "RechazadoInspeccion",
  
  EN_PROTOCOLIZACION: "EnProtocolizacion",
  FINALIZADO: "Finalizado",
  
  IMPORTADO: "Importado"
};

export const ESTADOS_ESTABLECIMIENTO = {
  EN_PROCESO_HABILITACION: "EnProcesoHabilitacion",
  HABILITADO: "Habilitado",
  INHABILITADO: "Inhabilitado",
  EN_PROCESO_RECTIFICACION: "EnProcesoRectificacion",
  EN_PROCESO_MODIFICACION: "EnProcesoModificacion",
  EN_PROCESO_RENOVACION: "EnProcesoRenovacion",
  PROXIMO_A_VENCER: "ProximoAVencer",
  VENCIDO: "Vencido",
  BAJA: "BAJA"
};

// ─── DTE Establecimiento ──────────────────────────────────────────────────────
export const DTE_ESTABLECIMIENTO = {
  Inicio: [
    { hacia: ESTADOS_TRAMITE.IMPORTADO, label: "Origen Importado" },
    { hacia: ESTADOS_ESTABLECIMIENTO.EN_PROCESO_HABILITACION, label: "Origen CliCSalud" }
  ],
  [ESTADOS_TRAMITE.IMPORTADO]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.HABILITADO, label: "Alta digital" }
  ],
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_HABILITACION]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.HABILITADO, label: "Inspección Aprobada / Dictamen Positivo" },
    { hacia: ESTADOS_ESTABLECIMIENTO.INHABILITADO, label: "Rechazo definitivo de Habilitación Inicial" }
  ],
  [ESTADOS_ESTABLECIMIENTO.HABILITADO]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RECTIFICACION, label: "Se detecta irregularidad menor o error material" },
    { hacia: ESTADOS_ESTABLECIMIENTO.EN_PROCESO_MODIFICACION, label: "Solicita cambio edilicio, de servicio o titularidad" },
    { hacia: ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RENOVACION, label: "Inicia trámite preventivo de renovación" },
    { hacia: ESTADOS_ESTABLECIMIENTO.PROXIMO_A_VENCER, label: "Alerta del sistema (ej. 90 días antes del vencimiento)" }
  ],
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RECTIFICACION]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.HABILITADO, label: "Corrección validada y aceptada" },
    { hacia: ESTADOS_ESTABLECIMIENTO.INHABILITADO, label: "Vence emplazamiento de rectificación sin resolver" }
  ],
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_MODIFICACION]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.HABILITADO, label: "Modificación aprobada (mantiene vigencia)" },
    { hacia: ESTADOS_ESTABLECIMIENTO.INHABILITADO, label: "Falta grave detectada en auditoría de modificación" }
  ],
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RENOVACION]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.HABILITADO, label: "Renovación aprobada (extiende vigencia)" },
    { hacia: ESTADOS_ESTABLECIMIENTO.INHABILITADO, label: "No cumple requisitos críticos para renovar" }
  ],
  [ESTADOS_ESTABLECIMIENTO.PROXIMO_A_VENCER]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RENOVACION, label: "Inicia trámite de Renovación desde alerta" },
    { hacia: ESTADOS_ESTABLECIMIENTO.VENCIDO, label: "Alcanza fecha límite sin iniciar renovación" },
    { hacia: ESTADOS_ESTABLECIMIENTO.INHABILITADO, label: "Sanción preventiva o revocación antes de vencer" }
  ],
  [ESTADOS_ESTABLECIMIENTO.VENCIDO]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RENOVACION, label: "Inicia Renovación tardía (con recargo/justificación)" },
    { hacia: ESTADOS_ESTABLECIMIENTO.INHABILITADO, label: "Clausura automática / Expiración de plazos de gracia" }
  ],
  [ESTADOS_ESTABLECIMIENTO.INHABILITADO]: [
    { hacia: ESTADOS_ESTABLECIMIENTO.BAJA, label: "Cierre definitivo o inactividad prolongada" }
  ],
  [ESTADOS_ESTABLECIMIENTO.BAJA]: []
};

// ─── Mapa de labels para mostrar en UI ───────────────────────────────────────
export const ESTADO_LABELS = {
  // Trámite: Arquitectura
  [ESTADOS_TRAMITE.BORRADOR_ARQUITECTURA]: "Borrador Arquitectura",
  [ESTADOS_TRAMITE.PENDIENTE_EVALUACION_ARQUITECTURA]: "Pendiente de Evaluación Arquitectura",
  [ESTADOS_TRAMITE.EN_ANALISIS_ARQUITECTURA]: "En Análisis Arquitectura",
  [ESTADOS_TRAMITE.OBSERVADO_ARQUITECTURA]: "Observado Arquitectura",
  [ESTADOS_TRAMITE.RECTIFICADO_ARQUITECTURA]: "Rectificado",
  [ESTADOS_TRAMITE.ADECUADO]: "Adecuado",
  [ESTADOS_TRAMITE.ADECUADO_CON_OBSERVACIONES]: "Adecuado con Observaciones",
  [ESTADOS_TRAMITE.RECHAZADO_ARQUITECTURA]: "Rechazado Arquitectura",
  // Trámite: Auditoria
  [ESTADOS_TRAMITE.BORRADOR_AUDITORIA]: "Borrador Auditoria",
  [ESTADOS_TRAMITE.PENDIENTE_EVALUACION_AUDITORIA]: "Pendiente de Evaluación Auditoria",
  [ESTADOS_TRAMITE.EN_ANALISIS_AUDITORIA]: "En Análisis Auditoria",
  [ESTADOS_TRAMITE.OBSERVADO_AUDITORIA]: "Observado Auditoria",
  [ESTADOS_TRAMITE.RECTIFICADO_AUDITORIA]: "Rectificado Auditoria",
  [ESTADOS_TRAMITE.RECHAZADO_AUDITORIA]: "Rechazado Auditoria",
  [ESTADOS_TRAMITE.ACEPTADO_DOCUMENTACION_AUDITORIA]: "Aceptado Documentación Auditoria",
  // Trámite: Inspección
  [ESTADOS_TRAMITE.OBSERVADO_INSPECCION]: "Observado Inspección",
  [ESTADOS_TRAMITE.RESPUESTA_EMPLAZAMIENTO]: "Respuesta de Emplazamiento",
  [ESTADOS_TRAMITE.ACEPTADO_INSPECCION]: "Aceptado Inspección",
  [ESTADOS_TRAMITE.RECHAZADO_INSPECCION]: "Rechazado Inspección",
  // Trámite: Protocolización
  [ESTADOS_TRAMITE.EN_PROTOCOLIZACION]: "En Protocolización",
  [ESTADOS_TRAMITE.FINALIZADO]: "Finalizado",
  // Trámite: Legado / importado
  [ESTADOS_TRAMITE.IMPORTADO]: "Importado",
  
  // Establecimiento
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_HABILITACION]: "En Proceso Habilitación",
  [ESTADOS_ESTABLECIMIENTO.HABILITADO]: "Habilitado",
  [ESTADOS_ESTABLECIMIENTO.INHABILITADO]: "Inhabilitado",
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RECTIFICACION]: "En Proceso Rectificación",
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_MODIFICACION]: "En Proceso Modificación",
  [ESTADOS_ESTABLECIMIENTO.EN_PROCESO_RENOVACION]: "En Proceso Renovación",
  [ESTADOS_ESTABLECIMIENTO.PROXIMO_A_VENCER]: "Próximo a Vencer",
  [ESTADOS_ESTABLECIMIENTO.VENCIDO]: "Vencido",
  [ESTADOS_ESTABLECIMIENTO.BAJA]: "Baja"
};

// ─── Estado inicial según origen ─────────────────────────────────────────────
export const ESTADO_INICIAL = {
  "TRAMITE EN CLICSALUD": "BorradorArquitectura",
  IMPORTADO: "Importado",
};

export const MOCK_ESTABLECIMIENTOS = [];

// ─── Historial de estados mock ────────────────────────────────────────────────
export const MOCK_HISTORIAL = {
  1: [
    { fecha: "2026-01-10", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Trámite iniciado en CliCSalud", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-01-15", estadoAnterior: "BorradorArquitectura", estadoNuevo: "PendienteEvaluacionArquitectura", motivo: "Envío de trámite etapa arquitectura", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-01-18", estadoAnterior: "PendienteEvaluacionArquitectura", estadoNuevo: "EnAnalisisArquitectura", motivo: "Agente RUGEPRESA visualiza el trámite", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
  ],
  2: [
    { fecha: "2026-02-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Trámite de renovación iniciado", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-02-05", estadoAnterior: "BorradorArquitectura", estadoNuevo: "PendienteEvaluacionArquitectura", motivo: "Envío etapa arquitectura", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-02-08", estadoAnterior: "PendienteEvaluacionArquitectura", estadoNuevo: "EnAnalisisArquitectura", motivo: "Agente visualiza el trámite", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
    { fecha: "2026-02-12", estadoAnterior: "EnAnalisisArquitectura", estadoNuevo: "ObservadoArquitectura", motivo: "Planos incompletos detectados", usuario: "Agente RUGEPRESA", tipo: "MANUAL" },
  ],
  3: [
    { fecha: "2025-11-10", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Trámite iniciado", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2025-11-20", estadoAnterior: "BorradorArquitectura", estadoNuevo: "PendienteEvaluacionArquitectura", motivo: "Envío etapa arquitectura", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2025-11-25", estadoAnterior: "PendienteEvaluacionArquitectura", estadoNuevo: "EnAnalisisArquitectura", motivo: "Agente visualiza el trámite", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
    { fecha: "2025-12-02", estadoAnterior: "EnAnalisisArquitectura", estadoNuevo: "AdecuadoConObservaciones", motivo: "Arquitectura aprobada con observaciones menores", usuario: "Agente RUGEPRESA", tipo: "MANUAL" },
  ],
  4: [
    { fecha: "2026-03-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Modificación iniciada", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-03-10", estadoAnterior: "BorradorArquitectura", estadoNuevo: "PendienteEvaluacionArquitectura", motivo: "Envío etapa arquitectura", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-03-14", estadoAnterior: "PendienteEvaluacionArquitectura", estadoNuevo: "EnAnalisisArquitectura", motivo: "Agente visualiza", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
    { fecha: "2026-03-18", estadoAnterior: "EnAnalisisArquitectura", estadoNuevo: "Adecuado", motivo: "Arquitectura aprobada sin observaciones", usuario: "Agente RUGEPRESA", tipo: "MANUAL" },
    { fecha: "2026-03-25", estadoAnterior: "Adecuado", estadoNuevo: "PendienteEvaluacionAuditoria", motivo: "Efector envía trámite completo", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-03-28", estadoAnterior: "PendienteEvaluacionAuditoria", estadoNuevo: "EnAnalisisAuditoria", motivo: "Agente visualiza auditoria", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
  ],
  5: [
    { fecha: "2025-10-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Renovación iniciada", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2025-10-10", estadoAnterior: "BorradorArquitectura", estadoNuevo: "PendienteEvaluacionArquitectura", motivo: "Envío etapa arquitectura", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2025-10-14", estadoAnterior: "PendienteEvaluacionArquitectura", estadoNuevo: "EnAnalisisArquitectura", motivo: "Agente visualiza", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
    { fecha: "2025-10-20", estadoAnterior: "EnAnalisisArquitectura", estadoNuevo: "Adecuado", motivo: "Arquitectura OK", usuario: "Agente RUGEPRESA", tipo: "MANUAL" },
    { fecha: "2025-11-01", estadoAnterior: "Adecuado", estadoNuevo: "PendienteEvaluacionAuditoria", motivo: "Trámite completo enviado", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2025-11-05", estadoAnterior: "PendienteEvaluacionAuditoria", estadoNuevo: "EnAnalisisAuditoria", motivo: "Agente visualiza auditoria", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
    { fecha: "2025-11-15", estadoAnterior: "EnAnalisisAuditoria", estadoNuevo: "RechazadoAuditoria", motivo: "Efector no respondió observaciones reiteradamente", usuario: "Agente RUGEPRESA", tipo: "MANUAL" },
  ],
  6: [
    { fecha: "2024-05-20", estadoAnterior: null, estadoNuevo: "Importado", motivo: "Importado desde el excel de DTE", usuario: "Sistema", tipo: "AUTOMÁTICO" },
  ],
  7: [
    { fecha: "2024-06-01", estadoAnterior: null, estadoNuevo: "Importado", motivo: "Importado desde el excel de DTE", usuario: "Sistema", tipo: "AUTOMÁTICO" },
    { fecha: "2024-07-15", estadoAnterior: "Importado", estadoNuevo: "BorradorArquitectura", motivo: "Se crea un trámite de alta digital", usuario: "Efector", tipo: "AUTOMÁTICO" },
  ],
  8: [
    { fecha: "2025-08-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Trámite iniciado", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2025-09-01", estadoAnterior: "BorradorArquitectura", estadoNuevo: "AceptadoDocumentacionAuditoria", motivo: "Documentación auditoria aprobada", usuario: "Agente RUGEPRESA", tipo: "MANUAL" },
    { fecha: "2025-10-15", estadoAnterior: "AceptadoDocumentacionAuditoria", estadoNuevo: "AceptadoInspeccion", motivo: "Actas de inspección sin observaciones", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
  ],
  9: [
    { fecha: "2026-04-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Modificación iniciada", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-04-15", estadoAnterior: "AceptadoDocumentacionAuditoria", estadoNuevo: "ObservadoInspeccion", motivo: "Acta de inspección con observaciones", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
  ],
  10: [
    { fecha: "2023-05-01", estadoAnterior: null, estadoNuevo: "Importado", motivo: "Importado desde el excel de DTE", usuario: "Sistema", tipo: "AUTOMÁTICO" },
    { fecha: "2023-06-01", estadoAnterior: "Importado", estadoNuevo: "AceptadoInspeccion", motivo: "Inspección aprobada", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
    { fecha: "2023-06-20", estadoAnterior: "AceptadoInspeccion", estadoNuevo: "EnProtocolizacion", motivo: "Resolución de habilitación emitida", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
  ],
  11: [
    { fecha: "2025-12-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Trámite iniciado", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-01-15", estadoAnterior: "EnProtocolizacion", estadoNuevo: "Finalizado", motivo: "Resolución protocolizada", usuario: "Agente RUGEPRESA", tipo: "AUTOMÁTICO" },
  ],
  12: [
    { fecha: "2026-05-01", estadoAnterior: null, estadoNuevo: "BorradorArquitectura", motivo: "Renovación iniciada", usuario: "Efector", tipo: "AUTOMÁTICO" },
    { fecha: "2026-05-20", estadoAnterior: "ObservadoInspeccion", estadoNuevo: "RespuestaEmplazamiento", motivo: "Efector registra respuesta de emplazamiento", usuario: "Efector", tipo: "AUTOMÁTICO" },
  ],
};
