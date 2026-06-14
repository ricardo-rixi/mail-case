import fs from 'fs';
import { execSync } from 'child_process';

const casesPath = '/data/.openclaw/workspace/mail-case/data/cases.json';
let cases = [];
if (fs.existsSync(casesPath)) {
  cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
}

const existingIds = new Set(cases.map(c => c.id));

// The 10 emails
const emails = [
  { id: "4032", subject: "Inside aef 2026: Energy Financing & Trading", from: "Africa Energy Forum", date: "2026-04-30T08:35:00-06:00" },
  { id: "4030", subject: "Your monthly newsletter | April 2026 | Gridworks’ Amari close, Nigeria shifts, critical minerals", from: "Energy News Network", date: "2026-04-29T09:25:00-06:00" },
  { id: "4029", subject: "Next Generation GOGET One", from: "GOGET", date: "2026-04-29T14:01:00+00:00" },
  { id: "4028", subject: "¿Qué estás esperando, Ricardo? 🤔", from: "Canva", date: "2026-04-28T02:17:00+00:00" },
  { id: "4021", subject: "Africa50, Genesis Energy, Seriti Green & USP&E to Host Boardrooms at aef 2026", from: "Africa Energy Forum", date: "2026-04-22T08:40:00-06:00" },
  { id: "4020", subject: "Pago confirmado del pedido 04855-6480994 de Canva", from: "EBANX/Canva", date: "2026-04-18T03:45:00+00:00" },
  { id: "4019", subject: "⚠️ Tu almacenamiento de Gmail está lleno al 86 %", from: "Google", date: "2026-04-17T14:01:00-07:00" },
  { id: "4018", subject: "Final day to save $2,000 | aef 2026", from: "Howard Yuchetel", date: "2026-04-17T05:18:00-06:00" },
  { id: "4017", subject: "🦺 The planning mistake that costs weeks", from: "John @ TeamGantt", date: "2026-04-15T20:03:00+00:00" },
  { id: "4016", subject: "Save $2,000 before 17 April | Industrialisation takes centre stage at aef 2026", from: "Africa Energy Forum", date: "2026-04-15T06:04:00-06:00" }
];

const descriptions = {
  "4032": "Africa Energy Forum envía un boletín informativo sobre el financiamiento y comercio de energía.\nObjeto: Promoción de la agenda del evento aef 2026 en Ciudad del Cabo.\nInterpretación: Correo promocional; no requiere acción operativa por parte de Ricardo.",
  "4030": "Energy News Network envía su boletín mensual de noticias del sector energético.\nObjeto: Compartir resúmenes de proyectos y novedades en el continente africano.\nInterpretación: Newsletter informativo; no requiere acción por parte de Ricardo.",
  "4029": "GOGET promociona la nueva generación de sus pantallas y sistemas para reserva de salas de reuniones.\nObjeto: Ofrecer mejoras de hardware y software para la gestión de espacios corporativos.\nInterpretación: Correo comercial/informativo; no requiere seguimiento ni acción directa.",
  "4028": "Canva sugiere a Ricardo que regrese a la plataforma para descubrir nuevas funcionalidades de inteligencia artificial y plantillas.\nObjeto: Correo automatizado de retención y promoción de herramientas de diseño.\nInterpretación: Promoción comercial; no requiere atención ni acción.",
  "4021": "Africa Energy Forum notifica sobre la participación de nuevas entidades (Africa50, Genesis Energy, Seriti Green) en los paneles del aef 2026.\nObjeto: Difusión de la agenda y sesiones ejecutivas del foro.\nInterpretación: Newsletter informativo y promocional; sin impacto operativo.",
  "4020": "EBANX confirma a Ricardo Carmona la recepción exitosa del pago de $330.00 MXN correspondiente a su suscripción o pedido en Canva.\nObjeto: Enviar comprobante de pago electrónico de servicio.\nInterpretación: Notificación administrativa de rutina; archivar para efectos de control de gastos.",
  "4019": "Google alerta a Ricardo que el almacenamiento de su cuenta de Gmail ha alcanzado el 86% de capacidad (13 GB de 15 GB).\nObjeto: Notificar el riesgo de saturación e invitar a liberar espacio o adquirir un plan superior.\nInterpretación: Alerta de infraestructura digital personal; requiere acción preventiva a mediano plazo.",
  "4018": "Howard Yuchetel de EnergyNet envía un recordatorio de la fecha límite para adquirir pases con descuento para el aef 2026.\nObjeto: Recordatorio comercial de cierre de tarifas promocionales.\nInterpretación: Correo publicitario urgente por fecha de corte, irrelevante para la operación de la empresa.",
  "4017": "TeamGantt comparte recomendaciones sobre la importancia de definir el alcance y alinear expectativas desde el inicio de un proyecto.\nObjeto: Boletín informativo con consejos de gestión de proyectos.\nInterpretación: Newsletter educativo; no requiere acción por parte de Ricardo.",
  "4016": "Africa Energy Forum envía un aviso anticipado sobre el cierre de tarifas promocionales para el registro en aef 2026.\nObjeto: Fomentar el registro temprano y promover las temáticas de industrialización del evento.\nInterpretación: Correo comercial; no requiere atención operativa."
};

const dateNow = new Date().toISOString();
let added = [];

for (const e of emails) {
  const caseId = `email-${e.id}-${new Date(e.date).getTime()}`;
  if (!existingIds.has(caseId)) {
    const newCase = {
      id: caseId,
      title: e.subject,
      description: descriptions[e.id],
      source: `Correo: ${e.from}`,
      owner: "Ricardo",
      status: "archivado",
      dueDate: null,
      unansweredDays: 0,
      receivedAt: new Date(e.date).toISOString(),
      createdAt: dateNow,
      updatedAt: dateNow
    };
    cases.unshift(newCase);
    added.push(newCase);
  }
}

fs.writeFileSync(casesPath, JSON.stringify(cases, null, 2));

console.log(JSON.stringify(added));

