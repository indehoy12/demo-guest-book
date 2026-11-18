# Panduan: Buka di VS Code dan Push ke GitHub (via Terminal)

Prasyarat: Node.js (LTS), Git, dan VS Code sudah terpasang. Cek di terminal:
```
node -v
npm -v
git --version
```

## 1. Ekstrak dan buka di VS Code
1. Ekstrak `srt-guestbook-demo.zip`, misalnya ke `C:\Projects`.
2. Buka PowerShell, lalu jalankan:
```
cd C:\Projects\guestbook-demo
code .
```
3. Di VS Code, buka terminal bawaan dengan `Ctrl + ``.

## 2. Jalankan lokal
```
npm install
npm run dev
```
Buka alamat yang tampil (biasanya http://localhost:5173). Tes build produksi:
```
npm run build
```

## 3. Buat repo kosong di GitHub
Buka https://github.com/new, isi nama `srt-guestbook-demo`, jangan centang README/.gitignore, lalu Create repository. Salin URL repo-nya.

## 4. Git push dari terminal VS Code
Pertama kali, atur identitas (lewati jika sudah pernah):
```
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```
Lalu:
```
git init
git add .
git commit -m "Demo Digital Guestbook & E-Signature"
git branch -M main
git remote add origin https://github.com/USERNAME/srt-guestbook-demo.git
git push -u origin main
```
Ganti `USERNAME` dengan username GitHub Anda. Jika diminta login, ikuti jendela browser yang muncul.

Alternatif dengan GitHub CLI (jika `gh` terpasang dan sudah `gh auth login`):
```
git init
git add .
git commit -m "Demo Digital Guestbook & E-Signature"
gh repo create srt-guestbook-demo --public --source=. --push
```

## 5. Update berikutnya
```
git add .
git commit -m "Pesan perubahan"
git push
```

## 6. Deploy ke Netlify
1. Netlify > Add new site > Import an existing project > pilih repo GitHub.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy. File `public/_redirects` sudah menangani SPA routing.
5. Domain demo (misalnya demo-guestbook.sumberrejekitech.web.id) diatur di Site configuration > Domain management, lalu arahkan DNS.

Catatan: URL konsultasi bisa diubah di konstanta `CONSULT` pada `src/App.tsx`.
