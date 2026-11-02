const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Configurazione Supabase (Legge dalle variabili d'ambiente di Render o usa valori di fallback)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Cani: LETTURA
app.get('/api/cani', async (req, res) => {
  const { data, error } = await supabase.from('cani').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// API Cani: INSERIMENTO
app.post('/api/cani', async (req, res) => {
  const { data, error } = await supabase.from('cani').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// API Cani: ELIMINAZIONE
app.delete('/api/cani/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('cani').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// API Attività: LETTURA
app.get('/api/attivita', async (req, res) => {
  const { data, error } = await supabase.from('attivita').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// API Attività: INSERIMENTO
app.post('/api/attivita', async (req, res) => {
  const { data, error } = await supabase.from('attivita').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// API Attività: ELIMINAZIONE
app.delete('/api/attivita/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('attivita').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server avviato sulla porta ${port}`);
});