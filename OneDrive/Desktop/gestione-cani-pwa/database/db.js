const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea o apre il database SQLite
const dbPath = path.resolve(__dirname, 'cani.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Errore durante l\'apertura del database:', err.message);
    } else {
        console.log('Connesso al database SQLite.');
    }
});

// Inizializzazione delle tabelle
db.serialize(() => {
    // Tabella Cani
    db.run(`
        CREATE TABLE IF NOT EXISTS cani (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            razza TEXT,
            data_nascita TEXT,
            microchip TEXT,
            note TEXT
        )
    `);

    // Tabella Scadenze
    db.run(`
        CREATE TABLE IF NOT EXISTS scadenze (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_cane INTEGER,
            tipo TEXT NOT NULL,
            data_scadenza TEXT NOT NULL,
            completato INTEGER DEFAULT 0,
            incaricato TEXT,
            note TEXT,
            FOREIGN KEY (id_cane) REFERENCES cani (id) ON DELETE CASCADE
        )
    `);
});

module.exports = db;