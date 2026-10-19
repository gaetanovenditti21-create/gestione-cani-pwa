const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware per analizzare il corpo delle richieste JSON
app.use(express.json());

// Servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Inizializzazione Supabase tramite le variabili d'ambiente di Render
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("ATTENZIONE: Variabili SUPABASE_URL e SUPABASE_KEY non trovate nelle variabili d'ambiente!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
//           ROTTE API - CANI
// ==========================================

// Leggi la lista di tutti i cani
app.get('/api/cani', async (req, res) => {
  const { data, error } = await supabase.from('cani').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Aggiungi un nuovo cane
app.post('/api/cani', async (req, res) => {
  const { nome, razza, data_nascita } = req.body;
  const { data, error } = await supabase.from('cani').insert([{ nome, razza, data_nascita }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Cancella un cane (e tutte le sue attività grazie a ON DELETE CASCADE)
app.delete('/api/cani/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('cani').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cane eliminato con successo' });
});

// ==========================================
//         ROTTE API - ATTIVITÀ
// ==========================================

// Leggi la lista di tutte le attività
app.get('/api/attivita', async (req, res) => {
  const { data, error } = await supabase
    .from('attivita')
    .select('*, cani(nome)')
    .order('data_ora', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Aggiungi una nuova attività
app.post('/api/attivita', async (req, res) => {
  const { cane_id, tipo, descrizione } = req.body;
  const { data, error } = await supabase.from('attivita').insert([{ cane_id, tipo, descrizione }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Cancella un'attività
app.delete('/api/attivita/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('attivita').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Attività eliminata con successo' });
});

// ==========================================
//          ROTTA PRINCIPALE (PWA)
// ==========================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
//              AVVIO SERVER
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server attivo sulla porta ${PORT}`);
});