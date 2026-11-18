# Demo Digital Guestbook & E-Signature — Sumber Rejeki Tech
Jalankan: `npm install` lalu `npm run dev`. Build: `npm run build` (output `dist`).
Netlify: build command `npm run build`, publish directory `dist`. File `public/_redirects` sudah menangani SPA routing.
Ubah URL konsultasi di konstanta `CONSULT` pada `src/App.tsx`.

Acara: aplikasi hanya untuk satu acara. Ubah nama, tanggal, dan lokasi di `src/event.ts`.

Sekali pakai: acara hanya satu dan bisa ditutup lewat tombol "Tutup acara" di Dashboard. Setelah ditutup, buku tamu dan kiosk terkunci dan data tidak bisa diubah atau dihapus.
