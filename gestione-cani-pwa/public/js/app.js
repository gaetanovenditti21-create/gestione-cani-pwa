document.addEventListener('DOMContentLoaded', () => {
    caricaCani();
    caricaScadenze();
});

async function caricaCani() {
    const res = await fetch('/api/cani');
    const cani = await res.json();
    
    const container = document.getElementById('lista-cani');
    const select = document.getElementById('select-cane-scadenza');
    
    container.innerHTML = cani.map(c => `
        <div class="item">
            <strong>${c.nome}</strong> (${c.razza || 'Razza non specificata'})
        </div>
    `).join('') || '<p>Nessun cane presente.</p>';

    select.innerHTML = '<option value="">Seleziona Cane</option>' + 
        cani.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

async function caricaScadenze() {
    const res = await fetch('/api/scadenze');
    const scadenze = await res.json();
    
    const container = document.getElementById('lista-scadenze');
    container.innerHTML = scadenze.map(s => `
        <div class="item ${s.completato ? 'completato' : ''}">
            <div>
                <strong>${s.tipo}</strong> - ${s.nome_cane || 'Tutti'}<br>
                <small>📅 ${s.data_scadenza} ${s.incaricato ? '| 👤 ' + s.incaricato : ''}</small>
            </div>
            <input type="checkbox" ${s.completato ? 'checked' : ''} onchange="toggleScadenza(${s.id}, this.checked)">
        </div>
    `).join('') || '<p>Nessuna scadenza inserita.</p>';
}

function mostraFormCane() { document.getElementById('form-cane').classList.toggle('hidden'); }
function mostraFormScadenza() { document.getElementById('form-scadenza').classList.toggle('hidden'); }

async function salvaCane(e) {
    e.preventDefault();
    const data = {
        nome: document.getElementById('nome-cane').value,
        razza: document.getElementById('razza-cane').value,
        data_nascita: document.getElementById('nascita-cane').value,
        microchip: document.getElementById('microchip-cane').value
    };
    await fetch('/api/cani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    mostraFormCane();
    caricaCani();
}

async function salvaScadenza(e) {
    e.preventDefault();
    const data = {
        id_cane: document.getElementById('select-cane-scadenza').value,
        tipo: document.getElementById('tipo-scadenza').value,
        data_scadenza: document.getElementById('data-scadenza').value,
        incaricato: document.getElementById('incaricato-scadenza').value
    };
    await fetch('/api/scadenze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    mostraFormScadenza();
    caricaScadenze();
}

async function toggleScadenza(id, completato) {
    await fetch(`/api/scadenze/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completato })
    });
    caricaScadenze();
}