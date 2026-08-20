self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installato');
});

self.addEventListener('fetch', (e) => {
    // Risposta diretta alle chiamate di rete
});