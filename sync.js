const fs = require('fs');

const casesFile = '/data/.openclaw/workspace/mail-case/data/cases.json';
const casesData = JSON.parse(fs.readFileSync(casesFile, 'utf-8'));
const casesMap = new Map(casesData.map(c => [c.id, c]));

const execSync = require('child_process').execSync;
const himalayaOutput = execSync('himalaya envelope list --page-size 1000 -o json', { encoding: 'utf-8' });
const jsonStr = himalayaOutput.substring(himalayaOutput.indexOf('[{'));
const envelopes = JSON.parse(jsonStr);

let added = 0;
for (const env of envelopes) {
    const caseId = `email-${env.id}`;
    if (!casesMap.has(caseId)) {
        const newCase = {
            id: caseId,
            title: env.subject,
            description: `Recibido de ${env.from.name || env.from.addr}. Asunto: ${env.subject}.\nInterpretación: Pendiente de revisar detalles y definir acción. Requiere validación por el equipo.`,
            source: `Correo: ${env.from.name || env.from.addr}`,
            owner: 'Ricardo',
            status: 'notsure',
            dueDate: null,
            unansweredDays: 0,
            receivedAt: env.date,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        casesData.unshift(newCase);
        added++;
        console.log(`Added: ${caseId} - ${env.subject}`);
    }
}

if (added > 0) {
    fs.writeFileSync(casesFile, JSON.stringify(casesData, null, 2));
    console.log(`Added ${added} new cases.`);
} else {
    console.log('No new cases added.');
}
