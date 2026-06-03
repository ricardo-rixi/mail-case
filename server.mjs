import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'cases.json');
const port = 4311;

fs.mkdirSync(dataDir, { recursive: true });

// Nueva estructura de base de datos JSON
// statuses: urgente, importante, notsure, porenviar, evento, seguimiento, archivado
const defaultCases = [
  {
    id: crypto.randomUUID(),
    title: 'TECHNICAL PROPOSAL HYDRAULIC PISTON',
    description: 'Propuesta técnica revisada de Silvana. Pendiente de revisión profunda.',
    source: 'Correo: Silvana Cusati',
    owner: 'Ricardo',
    status: 'importante',
    dueDate: null,
    unansweredDays: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Programa NATGAS IA — Maquetas en 5 días',
    description: 'Taracena pidió enviar propuestas hoy mismo. Prioridad alta.',
    source: 'Correo: Taracena',
    owner: 'Ricardo',
    status: 'urgente',
    dueDate: null,
    unansweredDays: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Facturas City Express',
    description: 'Facturas de estancia y viáticos. Dudas de archivo.',
    source: 'Correo',
    owner: 'Ricardo',
    status: 'notsure',
    dueDate: null,
    unansweredDays: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Cotización Proveedor X',
    description: 'Se pidió cotización el martes. Esperando respuesta.',
    source: 'Correo Enviado',
    owner: 'Ricardo',
    status: 'seguimiento',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    unansweredDays: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify(defaultCases, null, 2));
}

function readCases() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function saveCases(cases) {
  fs.writeFileSync(dataFile, JSON.stringify(cases, null, 2));
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath, contentType = 'text/html; charset=utf-8') {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/cases') {
    return sendJson(res, 200, readCases());
  }

  if (req.method === 'POST' && url.pathname === '/api/cases') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      const now = new Date().toISOString();
      const next = {
        id: crypto.randomUUID(),
        title: payload.title?.trim() || 'Caso sin título',
        description: payload.description?.trim() || '',
        source: payload.source?.trim() || 'Manual',
        owner: payload.owner?.trim() || 'Ricardo',
        status: payload.status || 'notsure',
        dueDate: payload.dueDate || null,
        unansweredDays: 0,
        createdAt: now,
        updatedAt: now
      };
      const cases = readCases();
      cases.unshift(next);
      saveCases(cases);
      sendJson(res, 201, next);
    });
    return;
  }

  if (req.method === 'PATCH' && url.pathname.startsWith('/api/cases/')) {
    const id = url.pathname.split('/').pop();
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      const cases = readCases();
      const idx = cases.findIndex(item => item.id === id);
      if (idx === -1) return sendJson(res, 404, { error: 'Case not found' });
      cases[idx] = {
        ...cases[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      saveCases(cases);
      sendJson(res, 200, cases[idx]);
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    return serveFile(res, path.join(publicDir, 'index.html'));
  }
  if (req.method === 'GET' && url.pathname === '/app.js') {
    return serveFile(res, path.join(publicDir, 'app.js'), 'application/javascript; charset=utf-8');
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`MailCase backend running on http://0.0.0.0:${port}`);
});
