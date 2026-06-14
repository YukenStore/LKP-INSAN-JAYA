self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
    // Biarkan kosong dulu, ini cuma syarat wajib dari Google biar web bisa di-install
});
