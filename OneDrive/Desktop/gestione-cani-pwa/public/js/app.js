document.addEventListener('DOMContentLoaded', () => {
  caricaCani();
  caricaAttivita();

  document.getElementById('formCane').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeCane').value;
    const razza = document.getElementById('razzaCane').value;

    await fetch('/api/cani', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, razza })
    });

    document.getElementById('formCane').reset();
    bootstrap.Modal.getInstance(document.getElementById('modalCane')).hide();
    caricaCani();
  });

  document.getElementById('formAttivita').addEventListener('submit', async (e) => {
    e.preventDefault();
    const descrizione = document.getElementById('descAttivita').value;

    await fetch('/api/attivita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descrizione })
    });

    document.getElementById('formAttivita').reset();
    bootstrap.Modal.getInstance(document.getElementById('modalAttivita')).hide();
    caricaAttivita();
  });
});

async function caricaCani() {
  const res = await fetch('/api/cani');
  const cani = await res.json();
  const lista = document.getElementById('lista-cani');
  
  if (cani.length === 0) {
    lista.innerHTML = '<p class="text-muted">Nessun cane presente.</p>';
    return;
  }

  lista.innerHTML = cani.map(c => `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${c.nome}</strong> ${c.razza ? `<span class="text-muted">(${c.razza})</span>` : ''}
      </div>
      <button class="btn btn-outline-danger btn-sm" onclick="eliminaCane('${c.id}')" title="Elimina Cane">✕</button>
    </div>
  `).join('');
}

async function eliminaCane(id) {
  if (!confirm('Vuoi davvero eliminare questo cane?')) return;
  await fetch(`/api/cani/${id}`, { method: 'DELETE' });
  caricaCani();
}

async function caricaAttivita() {
  const res = await fetch('/api/attivita');
  const attivita = await res.json();
  const lista = document.getElementById('lista-attivita');
  
  if (attivita.length === 0) {
    lista.innerHTML = '<p class="text-muted">Nessuna scadenza inserita.</p>';
    return;
  }

  lista.innerHTML = attivita.map(a => `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${a.descrizione}</strong>
      </div>
      <button class="btn btn-outline-danger btn-sm" onclick="eliminaAttivita('${a.id}')" title="Elimina Attività">🗑️</button>
    </div>
  `).join('');
}

async function eliminaAttivita(id) {
  if (!confirm('Vuoi davvero eliminare questa scadenza?')) return;
  await fetch(`/api/attivita/${id}`, { method: 'DELETE' });
  caricaAttivita();
}