const fs = require('fs');
const cases = JSON.parse(fs.readFileSync('./data/cases.json', 'utf8'));

let notsure = 0;
let seguimiento = 0;
let archivado = 0;
let urgente = 0;
let evento = 0;

cases.forEach(c => {
  if (c.status === 'notsure') notsure++;
  if (c.status === 'seguimiento') seguimiento++;
  if (c.status === 'archivado') archivado++;
  if (c.status === 'urgente') urgente++;
  if (c.status === 'evento') evento++;
});

console.log(`Total: ${cases.length}`);
console.log(`Notsure: ${notsure}`);
console.log(`Seguimiento: ${seguimiento}`);
console.log(`Archivado: ${archivado}`);
console.log(`Urgente: ${urgente}`);
console.log(`Evento: ${evento}`);
