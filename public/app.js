async function loadCases() {
  const response = await fetch('/api/cases');
  const cases = await response.json();
  
  const columns = [
    { id: 'urgente', title: 'URGENTES', color: 'text-error', bgColor: 'bg-error', bgPulse: 'animate-pulse' },
    { id: 'importante', title: 'IMPORTANTES', color: 'text-primary', bgColor: 'bg-primary' },
    { id: 'seguimiento', title: 'SEGUIMIENTO', color: 'text-secondary', bgColor: 'bg-secondary' },
    { id: 'archivado', title: 'ARCHIVADOS', color: 'text-on-surface-variant', bgColor: 'bg-surface-variant' },
    { id: 'otros', title: 'OTROS (Not sure / Eventos)', color: 'text-on-surface-variant', bgColor: 'bg-surface-variant' }
  ];

  const board = document.getElementById('kanban-board');
  board.innerHTML = '';

  columns.forEach(col => {
    let colCases = cases.filter(c => c.status === col.id);
    if (col.id === 'otros') {
      colCases = cases.filter(c => ['notsure', 'porenviar', 'evento'].includes(c.status));
    }

    let cardsHtml = colCases.map(c => `
      <div class="bg-surface-container p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group mb-3">
        <div class="flex justify-between items-start mb-2">
          <span class="text-[10px] uppercase tracking-widest ${col.color} bg-white/5 px-2 py-0.5 rounded font-bold">${c.source || 'Email'}</span>
          <span class="text-[10px] text-on-surface-variant">${new Date(c.receivedAt || c.createdAt).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'})}</span>
        </div>
        <h4 class="text-body-md font-body-md text-on-surface mb-2">${c.title}</h4>
        <p class="text-label-sm font-label-sm text-on-surface-variant line-clamp-2">${c.description || ''}</p>
      </div>
    `).join('');

    board.innerHTML += `
      <div class="min-w-[320px] w-[320px] flex flex-col gap-4">
        <div class="flex items-center justify-between pb-2 border-b border-white/5">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full ${col.bgColor} ${col.bgPulse || ''}"></div>
            <h3 class="text-label-md font-label-md ${col.color} uppercase tracking-wider">${col.title}</h3>
            <span class="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-2 rounded-full">${colCases.length}</span>
          </div>
        </div>
        <div class="flex flex-col gap-3 overflow-y-auto kanban-scroll" style="max-height: 550px;">
          ${cardsHtml}
        </div>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', loadCases);
