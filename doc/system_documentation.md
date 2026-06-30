# Dokumentasi Sistem LKP Insan Jaya
*Sistem Manajemen Akademik, Absensi, Pendaftaran, dan Laporan Belajar*

Dokumentasi ini dibuat untuk mempermudah serah terima dan keberlanjutan pengembangan (handover) project aplikasi LKP Insan Jaya. Dokumen ini menjelaskan fungsionalitas sistem saat ini, struktur file, konfigurasi, alur kerja (workflow), serta petunjuk teknis lainnya.

---

## Daftar Isi
1. [Deskripsi Umum](#1-deskripsi-umum)
2. [Struktur Direktori File](#2-struktur-direktori-file)
3. [Alur Fungsionalitas & Fitur Utama](#3-alur-fungsionalitas--fitur-utama)
4. [Panduan Instalasi & Menjalankan Aplikasi](#4-panduan-instalasi--menjalankan-aplikasi)
5. [Arsitektur Integrasi Backend & API](#5-arsitektur-integrasi-backend--api)
6. [Bypass Mode & Manajemen Hak Akses](#6-bypass-mode--manajemen-hak-akses)
7. [Panduan Pemeliharaan & Pengembangan Ke Depan](#7-panduan-pemeliharaan--pengembangan-ke-depan)

---

## 1. Deskripsi Umum
Aplikasi **LKP Insan Jaya** adalah sistem administrasi akademik internal yang dirancang khusus untuk mempermudah tugas pengelola (admin) dan instruktur (guru) di Lembaga Kursus dan Pelatihan (LKP) Insan Jaya. 

Aplikasi ini mencakup:
*   Pencatatan data siswa terdaftar.
*   Pencatatan absensi harian siswa (pertemuan 1-8 atau 1-12) oleh guru.
*   Pemantauan status pembayaran SPP siswa.
*   Pengelolaan pendaftaran siswa secara online & offline.
*   Pembuatan laporan hasil belajar bulanan (rapor) yang dapat diunduh dalam format gambar A4.

Aplikasi ini bersifat **Progressive Web App (PWA)** sehingga dapat diinstal di desktop atau handphone melalui peramban (browser) web, dan menggunakan backend serverless untuk efisiensi biaya operasional.

---

## 2. Struktur Direktori File
Project ini sangat minimalis, menggunakan struktur multi-page aplikasi statis tanpa compiler (seperti Webpack atau Vite). Semua file terletak langsung di root direktori:

```text
LKP-INSAN-JAYA/
├── index.html              # Halaman masuk (Login) dengan Google OAuth 2.0
├── dashboard.html          # Dashboard utama (Daftar & Edit Data Siswa)
├── absensi-siswa.html      # Form pencatatan absensi dan status SPP
├── absensi-karyawan.html   # Panel absensi mandiri karyawan (GPS/Selfie) & pantau pimpinan
├── pendaftaran.html        # Form pendaftaran siswa & kelas baru secara manual (offline)
├── rekap-online.html       # Rekapitulasi & persetujuan pendaftar yang mendaftar online
├── laporan.html            # Pembuat laporan belajar bulanan (A4 Image Export)
├── js/
│   ├── config.js           # Berkas konfigurasi global (URL API, Peran, Program, dll)
│   └── common.js           # Script helper bersama (layout, auth check, service worker installer)
├── image/
│   ├── Logo Insan Jaya.png # Logo LKP resolusi tinggi untuk tampilan web
│   ├── icon-192.png        # Ikon PWA untuk tampilan di perangkat seluler (192px)
│   └── icon-512.png        # Ikon PWA untuk tampilan di perangkat seluler (512px)
├── manifest.json           # File konfigurasi PWA (ikon, nama aplikasi, tema warna)
├── sw.js                   # Service Worker (syarat agar PWA bisa diinstal)
```

---

## 3. Alur Fungsionalitas & Fitur Utama

### A. Autentikasi & Login (`index.html`)
1. Pengguna membuka halaman login.
2. Login dilakukan menggunakan **Google Sign-In** melalui library resmi Google Identity Services.
3. Setelah login berhasil, token JWT dari Google didekode di sisi klien untuk mendapatkan:
   *   `name` (Nama lengkap pengguna)
   *   `email` (Alamat email Google)
   *   `picture` (Tautan foto profil)
4. Data tersebut disimpan ke dalam `localStorage` browser.
5. Sistem memeriksa kecocokan email pengguna dengan daftar email admin/guru untuk menentukan akses halaman selanjutnya. Jika lolos, pengguna dialihkan ke `dashboard.html`.

### B. Dashboard & Manajemen Data Siswa (`dashboard.html`)
*   **Tampilan Data**: Menampilkan data siswa terdaftar yang diambil dari backend API `/api/data`.
*   **Pencarian & Filter**: Menyediakan filter pencarian real-time berdasarkan *Nama Siswa*, *Program Belajar* (Bimbel, Calistung, Inggris, Arab, Komputer, Menggambar), *Instruktur*, dan *Nama Kelas*.
*   **Responsif Seluler**: Data ditampilkan dalam format tabel pada desktop dan format kartu geser (collapsible cards) pada perangkat mobile.
*   **Menu Aksi (Hanya Admin)**: Menyediakan tombol aksi berupa titik tiga (⋮) untuk mengedit profil siswa (Nama, Kelas, Instruktur, Program, Jadwal) atau menghapusnya secara permanen dari server.

### C. Sistem Pencatatan Absensi & SPP (`absensi-siswa.html`)
*   **Cascading Dropdown**: Guru harus memilih *Program Belajar* -> *Instruktur* -> *Nama Siswa* berturut-turut untuk membuka data absensi siswa bersangkutan.
*   **Format Absensi**: Mendukung dua opsi format pembelajaran: **8 pertemuan** (kursus pendek) atau **12 pertemuan** (reguler bulanan).
*   **Indikator Kehadiran**: Setiap pertemuan dapat diatur tanggal belajarnya dan status kehadirannya: *Hadir* (Hijau), *Izin* (Kuning), atau *Alfa* (Merah).
*   **Status SPP (Khusus Super Admin)**: Super Admin dapat mengubah status pembayaran SPP bulanan siswa menjadi *Lunas* atau *Belum Lunas*.
*   **Reset Absensi (Khusus Super Admin)**: Tombol untuk menghapus seluruh riwayat absen dan mengembalikan status SPP siswa menjadi *Belum Lunas* untuk memulai bulan baru.

### D. Pendaftaran Siswa Baru (`pendaftaran.html` & `rekap-online.html`)
*   **Pendaftaran Manual / Offline (`pendaftaran.html`)**: Digunakan oleh admin untuk memasukkan data siswa baru yang datang langsung ke LKP. Input mencakup biodata diri, data orang tua/wali, program belajar, pilihan jadwal standar, atau jadwal kustom per hari.
*   **Rekap Pendaftaran Online (`rekap-online.html`)**: Menampilkan daftar pendaftar yang mendaftar secara online (dari form publik). Admin dapat meninjau detail pendaftar secara lengkap, menandai pendaftar tersebut sebagai *Lunas* biaya pendaftaran, atau menghapusnya jika data tidak valid.
*   **Notifikasi Lencana (Badge)**: Jika terdapat pendaftaran online yang berstatus `Belum Lunas`, sistem akan menampilkan lencana jumlah pendaftar baru berwarna merah di menu sidebar pada seluruh halaman admin.

### E. Pembuat Laporan Belajar / Rapor (`laporan.html`)
*   **Pengisian Laporan**: Guru memilih siswa, mengisi bulan laporan, tanggal pembuatan, catatan perkembangan guru, serta materi dan hasil pembelajaran per baris (maksimal 8 baris agar muat dalam 1 halaman).
*   **Draf Otomatis**: Ketikan guru disimpan otomatis ke `localStorage` sehingga draf tidak akan hilang jika halaman tidak sengaja disegarkan.
*   **Visual Preview A4**: Menampilkan pratonton (preview) instan rapor berdesain resmi LKP Insan Jaya. Ukuran pratinjau akan menyesuaikan ukuran layar secara otomatis (responsive scale).
*   **Ekspor Gambar (JPG)**: Dengan bantuan library `dom-to-image`, guru dapat mengunduh rapor tersebut dalam bentuk file gambar berkualitas tinggi berukuran A4 standar yang siap dicetak atau dikirim langsung ke orang tua siswa melalui WhatsApp.

### F. Absensi Karyawan & Guru (`absensi-karyawan.html`)
*   **Absen Selfie & GPS (Karyawan)**: Mengakses kamera depan dan meminta lokasi GPS. Validasi membatasi pengisian absen hanya dalam radius 50 meter dari LKP. Foto selfie disimpan di Cloudflare R2 bucket.
*   **Sesi Kehadiran harian**: Mendukung check-in dan check-out untuk maksimal 2 sesi per hari (Pagi/Siang).
*   **Dashboard Pantau (Pimpinan)**: Admin/Pimpinan otomatis masuk ke tab pemantauan. Mereka dapat melihat riwayat kehadiran harian karyawan, foto verifikasi selfie, menambahkan data absen secara manual, mengedit status kehadiran (disertai catatan alasan edit), serta melihat tabel rekapitulasi kehadiran bulanan seluruh staf.

---

## 4. Panduan Instalasi & Menjalankan Aplikasi

Aplikasi ini tidak memiliki proses kompilasi (*build step*). Anda hanya memerlukan sebuah server web lokal statis.

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

### Cara Menjalankan Secara Lokal
1. Buka aplikasi terminal (PowerShell, CMD, atau Terminal macOS/Linux).
2. Arahkan direktori aktif ke folder project `LKP-INSAN-JAYA`.
3. Jalankan perintah berikut untuk memulai server statis lokal:
   ```bash
   npx serve .
   ```
4. Terminal akan memproses pengunduhan package `serve` (jika belum ada) dan meluncurkan server.
5. Salin dan buka alamat URL lokal yang diberikan, biasanya:
   👉 **`http://localhost:3000`**

*Catatan: Sangat disarankan mengakses lewat `localhost` daripada IP lokal (`192.168.x.x`) agar Google OAuth mengizinkan proses masuk.*

---

## 5. Arsitektur Integrasi Backend & API

Aplikasi berinteraksi dengan server backend Cloudflare Workers menggunakan fungsi pembantu `fetchWithAuth()`. Fungsi ini secara otomatis menyisipkan email user yang sedang aktif ke dalam header `X-Admin-Email` pada setiap request untuk keperluan otorisasi di server.

### Ringkasan Endpoint API
| Metode HTTP | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/data` | Mengambil data seluruh siswa terdaftar. |
| `POST` | `/api/submit` | Menyimpan data pendaftaran siswa baru secara resmi. |
| `POST` | `/api/kelas` | Menyimpan metadata kelas (guru, jadwal, program). |
| `POST` | `/api/edit` | Memperbarui detail profil siswa terdaftar. |
| `POST` | `/api/delete` | Menghapus siswa dari database. |
| `GET` | `/api/get-absensi-siswa` | Mengambil riwayat absen & status SPP siswa. |
| `POST` | `/api/save-absensi-siswa` | Menyimpan atau mereset data absen dan SPP siswa. |
| `GET` | `/api/pendaftaran-online/count`| Mengambil jumlah pendaftar online yang belum lunas. |
| `GET` | `/api/pendaftaran-online` | Mengambil daftar lengkap pendaftar online. |
| `POST` | `/api/pendaftaran-online/status`| Mengubah status pembayaran pendaftaran online. |
| `POST` | `/api/pendaftaran-online/delete`| Menghapus pendaftar online dari sistem. |
| `POST` | `/api/upload-foto-absensi` | Mengunggah foto selfie absensi karyawan ke Cloudflare R2 bucket. |
| `POST` | `/api/absensi-karyawan` | Menyimpan data check-in/check-out absensi karyawan (atau input manual). |
| `GET` | `/api/absensi-karyawan` | Mengambil riwayat data absensi karyawan per bulan. |
| `GET` | `/api/absensi-karyawan/hari-ini`| Mengambil daftar absensi harian seluruh karyawan untuk pimpinan. |
| `GET` | `/api/absensi-karyawan/rekap` | Mengambil data rekapitulasi kehadiran bulanan seluruh karyawan. |
| `PUT` | `/api/absensi-karyawan/:id` | Mengubah status kehadiran karyawan tertentu (oleh pimpinan). |
| `DELETE` | `/api/absensi-karyawan/:id` | Menghapus data absensi karyawan tertentu (oleh pimpinan). |

---

## 6. Bypass Mode & Manajemen Hak Akses

Karena Client ID Google saat ini dikonfigurasi khusus untuk domain produksi LKP dan port tertentu, Anda akan mengalami masalah `origin_mismatch` saat mencoba login di lingkungan lokal baru. 

Untuk mempermudah pengembangan, Anda dapat menggunakan **Developer Bypass Mode** untuk langsung masuk sebagai Admin atau Guru:

1. Buka browser pada alamat `http://localhost:3000`.
2. Tekan **F12** -> masuk ke tab **Console**.
3. Ketikkan salah satu perintah JavaScript di bawah ini, lalu tekan **Enter**.

### A. Bypass sebagai Super Admin (Akses Penuh)
```javascript
localStorage.setItem('lkp_user_email', 'yumenoboken@gmail.com');
localStorage.setItem('lkp_user_name', 'Super Admin Dev');
localStorage.setItem('lkp_user_picture', 'https://via.placeholder.com/150');
window.location.href = 'dashboard.html';
```

### B. Bypass sebagai Guru / Instruktur (Hanya Mengisi Absen & Membuat Laporan)
```javascript
localStorage.setItem('lkp_user_email', 'mlbb080106@gmail.com');
localStorage.setItem('lkp_user_name', 'Guru Dev');
localStorage.setItem('lkp_user_picture', 'https://via.placeholder.com/150');
window.location.href = 'dashboard.html';
```

---

## 7. Panduan Pemeliharaan & Pengembangan Ke Depan

Sebagai developer yang melanjutkan project ini, berikut beberapa rekomendasi peningkatan kualitas kode (refactoring) yang dapat Anda lakukan:

1.  **Arsitektur Konfigurasi Sentral (Sudah Diimplementasikan)**
    Seluruh variabel konfigurasi penting (seperti daftar email admin/guru `CONFIG.ADMIN_EMAILS`, daftar program studi, pilihan kelas, pilihan instruktur, dan base URL API) kini telah dipusatkan pada berkas `js/config.js`. Navigasi sidebar dinamis dan otentikasi halaman diatur oleh `js/common.js`. Developer selanjutnya disarankan untuk selalu mengimpor kedua berkas ini di halaman baru.
2.  **Perubahan Google OAuth Client ID**
    Jika Anda ingin merilis aplikasi ini ke domain baru atau port lokal yang berbeda secara permanen, buatlah Kredensial OAuth Web Client baru di Google Cloud Console, daftarkan URL asal (origins), dan ganti variabel `client_id` pada baris **133** di file [index.html](file:///c:/Users/lenov/OneDrive/Dokumen/Project/LKP-INSAN-JAYA/index.html#L133).
3.  **Pengoptimalan PWA Caching**
    File [sw.js](file:///c:/Users/lenov/OneDrive/Dokumen/Project/LKP-INSAN-JAYA/sw.js) saat ini memiliki event handler `fetch` yang kosong. Untuk meningkatkan kecepatan muat aplikasi secara offline, Anda dapat menerapkan strategi caching statis (seperti Cache-First untuk file HTML, CSS, JS lokal dan Logo).
4.  **Validasi Sisi Server**
    Keamanan aplikasi saat ini sangat bergantung pada kejujuran email di local storage (`X-Admin-Email`). Ke depan, sangat disarankan untuk menerapkan validasi token Google (ID Token) yang sebenarnya di sisi backend Workers demi keamanan data siswa yang lebih kuat.
