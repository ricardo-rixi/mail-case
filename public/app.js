let currentModalTarget = null;
let currentModalAction = null;

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return response.json();
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `Hace ${interval} año${interval === 1 ? '' : 's'}`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `Hace ${interval} día${interval === 1 ? '' : 's'}`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `Hace ${interval} hora${interval === 1 ? '' : 's'}`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `Hace ${interval} min`;
  return 'Justo ahora';
}

function createCard(item) {
  let borderClass = 'border-slate-700 hover:border-slate-600';
  let badgeHtml = '';

  if (item.status === 'urgente') borderClass = 'border-l-4 border-l-rose-500 border-y border-r border-slate-700';
  if (item.status === 'importante') borderClass = 'border-l-4 border-l-cyan-400 border-y border-r border-slate-700';
  
  if (item.status === 'seguimiento' && item.unansweredDays > 0) {
    badgeHtml = `<span class="bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded border border-rose-500/30">Unanswered: ${item.unansweredDays}d</span>`;
  } else if (item.dueDate) {
    badgeHtml = `<span class="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600">Agendado: ${new Date(item.dueDate).toLocaleDateString()}</span>`;
  }

  // Format reception date/time (item.receivedAt) on the right
  const receivedDate = item.receivedAt ? new Date(item.receivedAt) : new Date(item.createdAt);
  const formattedReceived = receivedDate.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return `
    <div class="bg-slate-800 rounded-lg p-3 flex flex-col shadow-md border ${borderClass} transition-all group">
      <div class="flex justify-between items-start cursor-pointer w-full" onclick="toggleDetails('${item.id}')">
        <div class="flex flex-col w-full pr-2">
          <div class="flex justify-between items-start gap-2 w-full">
            <span class="text-sm text-slate-100 font-medium break-words">${item.title}</span>
            <span class="text-[10px] text-slate-400 shrink-0 font-medium bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/50">${formattedReceived}</span>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-[11px] text-slate-500">Cargado: ${timeAgo(item.createdAt)}</span>
            ${badgeHtml}
          </div>
        </div>
        <span class="material-symbols-outlined text-slate-500 transition-transform self-center" id="icon-${item.id}">expand_more</span>
      </div>

      <div id="details-${item.id}" class="hidden flex-col mt-3 pt-3 border-t border-slate-700 w-full">
        <div class="text-sm text-slate-300 mb-4 whitespace-pre-wrap">${item.description || 'Sin detalles.'}</div>
        
        <div class="flex justify-end gap-1.5 w-full">
          <button onclick="openModal('${item.id}', 'porenviar'); event.stopPropagation();" class="p-1.5 rounded border border-transparent hover:bg-slate-700/50 text-indigo-400 transition-all" title="Enviar Correo">
            <span class="material-symbols-outlined text-[18px]">send</span>
          </button>
          <button onclick="openModal('${item.id}', 'evento'); event.stopPropagation();" class="p-1.5 rounded border border-transparent hover:bg-slate-700/50 text-emerald-400 transition-all" title="Crear Evento/Agenda">
            <span class="material-symbols-outlined text-[18px]">event</span>
          </button>
          <button onclick="openModal('${item.id}', 'seguimiento'); event.stopPropagation();" class="p-1.5 rounded border border-transparent hover:bg-slate-700/50 text-amber-400 transition-all" title="Seguimiento / Unanswered">
            <span class="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <div class="w-px h-6 bg-slate-700 mx-1 self-center"></div>
          <button onclick="changeStatus('${item.id}', 'urgente'); event.stopPropagation();" class="p-1.5 rounded border border-transparent hover:bg-rose-500/10 text-rose-400 transition-all" title="Mover a Urgente">
            <span class="material-symbols-outlined text-[18px]">priority_high</span>
          </button>
          <button onclick="changeStatus('${item.id}', 'archivado'); event.stopPropagation();" class="p-1.5 rounded border border-transparent hover:bg-slate-700/50 text-slate-400 transition-all" title="Archivar">
            <span class="material-symbols-outlined text-[18px]">archive</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

window.toggleDetails = function(id) {
  const details = document.getElementById(`details-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  if (details.classList.contains('hidden')) {
    details.classList.remove('hidden'); details.classList.add('flex');
    icon.classList.add('rotate-180');
  } else {
    details.classList.add('hidden'); details.classList.remove('flex');
    icon.classList.remove('rotate-180');
  }
};

window.changeStatus = async function(id, status, dueDate = null) {
  await api('/api/cases/' + id, { method: 'PATCH', body: JSON.stringify({ status, dueDate }) });
  render();
};

window.openModal = function(id, action) {
  currentModalTarget = id;
  currentModalAction = action;
  
  const titleMap = {
    'porenviar': 'Programar envío',
    'evento': 'Agendar evento',
    'seguimiento': 'Recordar revisar'
  };
  
  document.getElementById('modal-title').textContent = titleMap[action];
  document.getElementById('date-modal').classList.remove('hidden-view');
};

window.closeModal = function() {
  document.getElementById('date-modal').classList.add('hidden-view');
  currentModalTarget = null;
  currentModalAction = null;
};

window.submitModal = function(timing) {
  let date = new Date();
  if (timing === 'hoy') date.setHours(18, 0, 0, 0);
  else if (timing === 'manana') date.setDate(date.getDate() + 1);
  else if (timing === 'semana') date.setDate(date.getDate() + 7);
  else if (timing === 'custom') {
    const val = document.getElementById('custom-date').value;
    if (val) date = new Date(val);
  }
  
  changeStatus(currentModalTarget, currentModalAction, date.toISOString());
  closeModal();
};

window.switchView = function(viewId) {
  ['home', 'porenviar', 'evento', 'seguimiento', 'archivado'].forEach(v => {
    document.getElementById(`view-${v}`).classList.add('hidden-view');
    const btn = document.getElementById(`nav-${v}`);
    btn.classList.remove('text-cyan-400');
    btn.classList.add('text-slate-400');
    btn.querySelector('span').classList.remove('icon-fill');
  });
  
  document.getElementById(`view-${viewId}`).classList.remove('hidden-view');
  const activeBtn = document.getElementById(`nav-${viewId}`);
  activeBtn.classList.remove('text-slate-400');
  activeBtn.classList.add('text-cyan-400');
  activeBtn.querySelector('span').classList.add('icon-fill');
  
  const titles = {
    'home': 'Home', 'porenviar': 'Correos por Enviar',
    'evento': 'Eventos', 'seguimiento': 'Seguimiento', 'archivado': 'Archivados'
  };
  document.getElementById('header-title').textContent = titles[viewId];
};

async function render() {
  const cases = await api('/api/cases');
  
  const sections = ['urgente', 'importante', 'notsure', 'porenviar', 'evento', 'seguimiento', 'archivado'];
  
  sections.forEach(status => {
    const section = document.getElementById(`section-${status}`);
    if (!section) return;
    const list = section.querySelector('.list-container');
    const filtered = cases.filter(c => c.status === status);
    
    list.innerHTML = filtered.length > 0 
      ? filtered.map(createCard).join('') 
      : '<div class="p-3 text-center text-slate-500 text-[11px]">Lista vacía</div>';
  });
}

render();
