const fs = require('fs');

const path = '/data/.openclaw/workspace/mail-case/data/cases.json';
let cases = [];
if (fs.existsSync(path)) {
  cases = JSON.parse(fs.readFileSync(path, 'utf8'));
}

const newCases = [
  {
    "id": "email-5090",
    "title": "FW: Comentarios para Respuesta a Trámite Permiso Comercialización",
    "description": "Sandra Castro (Asuntos Regulatorios) confirma a Ricardo la revisión y actualización de las cartas para el trámite del Permiso de Comercialización (añadiendo nota aclaratoria sobre volúmenes).\nObjeto: Avanzar en la gestión y cumplimiento del trámite regulatorio ante la autoridad.\nInterpretación: Confirmación de ajuste documental interno; el trámite sigue su curso.",
    "source": "Correo: Sandra Noemi Castro Tostado",
    "owner": "Ricardo",
    "status": "archivado",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T20:19:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  },
  {
    "id": "email-5089",
    "title": "FW: CV Ingeniería, Construcción y Servicios Integrales OIL &GAS",
    "description": "Isaac Eli Reynoso Ortega comparte con Rosa Martha Manjarrez y Valerio Manta el CV corporativo de ICSI Oil & Gas, un posible nuevo contratista para interconexiones CENAGAS, y confirma visita a Arco 57.\nObjeto: Evaluar alternativas técnicas y operativas con un nuevo proveedor.\nInterpretación: Seguimiento comercial y técnico de posibles proveedores; requiere validación técnica.",
    "source": "Correo: Isaac Eli Reynoso Ortega",
    "owner": "Ricardo",
    "status": "seguimiento",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T19:32:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  },
  {
    "id": "email-5088",
    "title": "FW: Cromatografía Querétaro junio 2026",
    "description": "Alonso Samperio solicita a Eduardo Aguilar (Engie) la cromatografía correspondiente al mes de junio para la zona de Querétaro.\nObjeto: Obtener los reportes de calidad de gas del mes anterior para su archivo y control.\nInterpretación: Solicitud técnica de rutina en la cual Ricardo se encuentra copiado.",
    "source": "Correo: Alonso Samperio Gayosso",
    "owner": "Ricardo",
    "status": "seguimiento",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T19:29:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  },
  {
    "id": "email-5087",
    "title": "FW: Cromatografía Mexicana de Gas junio 2026",
    "description": "Alonso Samperio solicita a Alberto Reyes (Diavaz) la cromatografía correspondiente al mes de junio para Mexicana de Gas (Apodaca y Universidad).\nObjeto: Obtener los reportes de calidad de gas del mes anterior para su archivo y control.\nInterpretación: Solicitud técnica de rutina en la cual Ricardo se encuentra copiado.",
    "source": "Correo: Alonso Samperio Gayosso",
    "owner": "Ricardo",
    "status": "seguimiento",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T19:28:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  },
  {
    "id": "email-5086",
    "title": "FW: Cromatografía Jalisco junio 2026",
    "description": "Alonso Samperio solicita a Luis Wario (Engie) la cromatografía correspondiente al mes de junio para la zona de Jalisco.\nObjeto: Obtener los reportes de calidad de gas del mes anterior para su archivo y control.\nInterpretación: Solicitud técnica de rutina en la cual Ricardo se encuentra copiado.",
    "source": "Correo: Alonso Samperio Gayosso",
    "owner": "Ricardo",
    "status": "seguimiento",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T19:27:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  },
  {
    "id": "email-5085",
    "title": "FW: Cromatografía México junio 2026",
    "description": "Alonso Samperio solicita a Erika Huerta (Engie) la cromatografía correspondiente al mes de junio para la zona de México.\nObjeto: Obtener los reportes de calidad de gas del mes anterior para su archivo y control.\nInterpretación: Solicitud técnica de rutina en la cual Ricardo se encuentra copiado.",
    "source": "Correo: Alonso Samperio Gayosso",
    "owner": "Ricardo",
    "status": "seguimiento",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T19:26:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  },
  {
    "id": "email-5084",
    "title": "FW: Índice Bidweek (HSCH) y Tipo de Cambio para Cliente",
    "description": "ENGIE Mexico (LATMX-Notificacion Operativa) envía a Ricardo Carmona el reporte del Índice Bidweek (HSCH) y Tipo de Cambio para varias estaciones.\nObjeto: Compartir las variaciones de los índices mensuales de mercado para julio 2026.\nInterpretación: Documento informativo comercial y financiero; requiere archivar para conciliaciones.",
    "source": "Correo: LATMX-Notificacion Operativa (ENGIE Mexico)",
    "owner": "Ricardo",
    "status": "archivado",
    "dueDate": null,
    "unansweredDays": 0,
    "receivedAt": "2026-07-07T17:58:00.000Z",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  }
];

cases = [...newCases, ...cases];
fs.writeFileSync(path, JSON.stringify(cases, null, 2));
console.log("Inserted " + newCases.length + " items.");
