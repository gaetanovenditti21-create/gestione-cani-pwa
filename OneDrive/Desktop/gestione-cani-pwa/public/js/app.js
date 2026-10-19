document.addEventListener("DOMContentLoaded", () => {
  // Registrazione Service Worker per PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Error:', err));
  }

  caricaCani();
  caricaAttivita();

  // Form Aggiunta Cane
  document.getElementById("form-cane").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome-cane").value;
    const razza = document.getElementById("razza-cane").value;
    const data_nascita = document.getElementById("nascita-cane").value;

    await fetch("/api/cani", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, razza, data_nascita })
    });

    document.getElementById("form-cane").reset();
    caricaCani();
  });

  // Form Registrazione Attività
  document.getElementById("form-attivita").addEventListener("submit", async (e) => {
    e.preventDefault();
    const cane_id = document.getElementById("select-cane").value;
    const tipo = document.getElementById("tipo-attivita").value;
    const descrizione = document.getElementById("desc-attivita").value;

    await fetch("/api/attivita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cane_id, tipo, descrizione })
    });

    document.getElementById("desc-attivita").value = "";
    caricaAttivita();
  });
});

async function caricaCani() {
  const res = await fetch("/api/cani");
  const cani = await res.json();

  const listaDiv = document.getElementById("lista-cani");
  const select = document.getElementById("select-cane");

  listaDiv.innerHTML = "";
  select.innerHTML = "";

  if (cani.length === 0) {
    listaDiv.innerHTML = "<small style='color: #6b7280;'>Nessun cane registrato.</small>";
  } else {
    cani.forEach(cane => {
      listaDiv.innerHTML += `
        <div class="cane-badge">
          🐶 ${cane.nome}
          <button onclick="eliminaCane(${cane.id}, '${cane.nome}')" style="background:none; border:none; color:#ef4444; margin-left:6px; cursor:pointer; font-weight:bold;">✕</button>
        </div>
      `;
      select.innerHTML += `<option value="${cane.id}">${cane.nome}</option>`;
    });
  }
}

async function caricaAttivita() {
  const res = await fetch("/api/attivita");
  const attivita = await res.json();

  const listaUl = document.getElementById("lista-attivita");
  listaUl.innerHTML = "";

  if (attivita.length === 0) {
    listaUl.innerHTML = "<li style='padding:10px; color:#6b7280;'>Nessuna attività registrata.</li>";
    return;
  }

  attivita.slice(0, 15).forEach(act => {
    const data = new Date(act.data_ora).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
    listaUl.innerHTML += `
      <li class="activity-item">
        <div>
          <strong>${act.cani ? act.cani.nome : 'Cane'}</strong>: ${act.tipo}
          <br><small>${act.descrizione || ''}</small>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="activity-time">${data}</span>
          <button onclick="eliminaAttivita(${act.id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.1rem;">🗑️</button>
        </div>
      </li>
    `;
  });
}

async function eliminaCane(id, nome) {
  if (confirm(`Sei sicuro di voler eliminare ${nome}? Verranno eliminate anche tutte le sue attività registrate.`)) {
    await fetch(`/api/cani/${id}`, { method: "DELETE" });
    caricaCani();
    caricaAttivita();
  }
}

async function eliminaAttivita(id) {
  if (confirm("Vuoi davvero eliminare questa attività/scadenza?")) {
    await fetch(`/api/attivita/${id}`, { method: "DELETE" });
    caricaAttivita();
  }
}