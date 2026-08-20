const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API CANI ---

// Ottieni tutti i cani
app.get('/api/cani', (req, res) => {
    db.all('SELECT * FROM cani', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Aggiungi un nuovo cane
app.post('/api/cani', (req, res) => {
    const { nome, razza, data_nascita, microchip, note } = req.body;
    const sql = `INSERT INTO cani (nome, razza, data_nascita, microchip, note) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nome, razza, data_nascita, microchip, note], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Cane aggiunto con successo!' });
    });
});

// --- API SCADENZE ---

// Ottieni tutte le scadenze con il nome del cane
app.get('/api/scadenze', (req, res) => {
    const sql = `
        SELECT scadenze.*, cani.nome AS nome_cane 
        FROM scadenze 
        LEFT JOIN cani ON scadenze.id_cane = cani.id
        ORDER BY data_scadenza ASC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Aggiungi una nuova scadenza
app.post('/api/scadenze', (req, res) => {
    const { id_cane, tipo, data_scadenza, incaricato, note } = req.body;
    const sql = `INSERT INTO scadenze (id_cane, tipo, data_scadenza, incaricato, note) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [id_cane, tipo, data_scadenza, incaricato, note], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Scadenza aggiunta con successo!' });
    });
});

// Cambia stato completamento di una scadenza
app.patch('/api/scadenze/:id', (req, res) => {
    const { completato } = req.body;
    const sql = `UPDATE scadenze SET completato = ? WHERE id = ?`;
    db.run(sql, [completato ? 1 : 0, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Stato aggiornato!' });
    });
});

// Avvio Server
app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});