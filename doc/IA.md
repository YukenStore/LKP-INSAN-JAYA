# Arsitektur Informasi (IA)
## Sistem Manajemen Akademik & Absensi LKP Insan Jaya

Dokumen ini merinci struktur informasi, navigasi, dan aliran data dalam aplikasi LKP Insan Jaya. Dokumen IA ini bertujuan untuk memberikan panduan jelas mengenai bagaimana konten dan fitur disusun untuk mempermudah navigasi pengguna serta pemeliharaan sistem.

---

## 1. Peta Situs (Sitemap) & Hirarki Halaman

Aplikasi ini menggunakan struktur multi-halaman statis (Jamstack) yang terintegrasi menggunakan navigasi sidebar dinamis yang dikelola oleh `js/common.js`.

```mermaid
graph TD
    Login[Login: index.html] -->|Google Auth / Bypass| Dashboard[Dashboard: dashboard.html]
    
    Dashboard -->|Sidebar Navigation| AbsensiSiswa[Absensi Siswa: absensi siswa.html]
    Dashboard -->|Sidebar Navigation| AbsensiKaryawan[Absensi Karyawan: absensi-karyawan.html]
    Dashboard -->|Sidebar Navigation| PendaftaranBaru[Pendaftaran Baru: pendaftaran.html]
    Dashboard -->|Sidebar Navigation| LaporanBelajar[Laporan Belajar: laporan.html]
    Dashboard -->|Sidebar Navigation| RekapOnline[Pendaftaran Online: rekap-online.html]
    
    %% Hak Akses Pembatasan
    classDef adminOnly fill:#fee2e2,stroke:#ef4444,stroke-width:2px;
    classDef public fill:#f3f4f6,stroke:#9ca3af,stroke-width:1px;
    classDef staff fill:#e0e7ff,stroke:#6366f1,stroke-width:1px;
    
    class Login public;
    class Dashboard staff;
    class AbsensiSiswa staff;
    class AbsensiKaryawan staff;
    class LaporanBelajar staff;
    class PendaftaranBaru adminOnly;
    class RekapOnline adminOnly;
```

### Tabel Rincian Halaman & Konten

| Berkas Fisik | Judul Menu / Halaman | Pengguna | Elemen Utama / Konten |
| :--- | :--- | :--- | :--- |
| `index.html` | Masuk (Login) | Publik | Button Google SSO, Logo LKP, Logo Developer Bypass (5x Klik). |
| `dashboard.html` | Data Siswa Aktif | Semua Staf | Summary Cards (Total Siswa, Pendaftar Baru), Pencarian Nama, Filter (Program, Instruktur, Kelas), Tabel Siswa (Collapsible Card di HP), Aksi Sunting/Hapus (Hanya Admin). |
| `absensi siswa.html` | Absensi Siswa | Semua Staf | Dropdown bertingkat (Program $\rightarrow$ Instruktur $\rightarrow$ Siswa), Tabel Pertemuan (8 atau 12 sesi), Input Tanggal & Status Kehadiran, Status SPP (Admin), Reset Absensi (Admin). |
| `absensi-karyawan.html` | Absensi Karyawan | Semua Staf / Pimpinan | **Absen Saya**: Tombol GPS & Akses Kamera Selfie.<br>**Riwayat Saya**: Tabel riwayat bulanan.<br>**Pantau Karyawan (Pimpinan)**: Rekap harian, bulanan, Edit & Hapus absensi karyawan. |
| `pendaftaran.html` | Pendaftaran Baru | Admin / Super Admin | Formulir data diri siswa, NISN, NIK, Detail Jadwal Belajar Kustom (Senin - Sabtu), Data Orang Tua / Wali. |
| `rekap-online.html` | Pendaftaran Online | Admin / Super Admin | Daftar kiriman form online web publik, Verifikasi Pembayaran Formulir, Konfirmasi Menjadi Siswa Aktif, Hapus Pendaftaran. |
| `laporan.html` | Laporan Hasil Belajar | Semua Staf | Pengisian draf rapor (otomatis tersimpan), Tabel kompetensi nilai belajar (Maks 8 baris), Pratonton A4 Cetak, Ekspor File JPG. |

---

## 2. Alur Navigasi & Pengalaman Pengguna (User Flow)

Sistem menggunakan layout navigasi sidebar dinamis. Layout ini diinjeksikan secara real-time ke dalam elemen `<div id="sidebar-placeholder"></div>`.

### Alur Autentikasi & Otorisasi
```mermaid
sequenceDiagram
    actor User as Pengguna (Staf/Admin)
    participant Browser as Browser (Lokal)
    participant API as Backend Workers API

    User->>Browser: Buka index.html
    alt Google SSO
        User->>Browser: Klik Login with Google
        Browser->>API: Verifikasi Kredensial Google
        API-->>Browser: Kembalikan Payload JWT
    else Developer Bypass Mode
        User->>Browser: Klik logo 5x & masukkan email
    end
    
    Browser->>Browser: Simpan email, nama, foto ke localStorage
    Browser->>Browser: Arahkan ke dashboard.html
    
    Note over Browser: script js/common.js berjalan otomatis
    Browser->>Browser: Validasi sesi email di localStorage
    alt Sesi Kosong
        Browser-->>User: Alihkan paksa kembali ke index.html
    else Halaman Khusus Admin & User bukan Admin
        Browser-->>User: Tampilkan alert akses ditolak & alihkan ke dashboard.html
    end
```

---

## 3. Matriks Peran & Hak Akses (RBAC)

Akses menu samping (sidebar) dan endpoint API dibatasi berdasarkan alamat email pengguna yang dikonfigurasikan di [js/config.js](file:///c:/Users/lenov/OneDrive/Dokumen/Project/LKP-INSAN-JAYA/js/config.js).

| Peran | Ciri Akun (localStorage) | Akses Menu Sidebar | Akses Operasional API |
| :--- | :--- | :--- | :--- |
| **Super Admin / Pimpinan** | Email terdaftar di `ADMIN_EMAILS` (misal: `lpkinsanjaya@gmail.com`) | Semua Menu (Pendaftaran Online, Pendaftaran Baru, Absensi Siswa, Absensi Karyawan, Data Siswa Aktif, Rapor, Latihan Soal). | CRUD Data Siswa, Pengubahan SPP, Reset Absensi Siswa, Manajemen & Verifikasi Absensi Karyawan. |
| **Admin / Staf TU** | Email terdaftar di `ADMIN_EMAILS` | Semua Menu. | CRUD Data Siswa, Verifikasi Absen Karyawan, Pendaftaran Online/Offline. *Tidak memiliki izin Reset data.* |
| **Instruktur / Guru** | Email **TIDAK** terdaftar di `ADMIN_EMAILS` tapi terdaftar sebagai Pengajar | Menu Terbatas: Absensi Siswa, Absensi Karyawan (Hanya Absen Saya), Data Siswa Aktif (Hanya Baca), Laporan Hasil Belajar. | Mengisi Absensi Siswa per Sesi, Membuat Laporan Belajar Siswa, Mengisi Absen Selfie Karyawan. |

---

## 4. Aliran Data & Penyimpanan

Aplikasi ini mengombinasikan penyimpanan lokal browser (client-side) dan database serverless (cloud) untuk sinkronisasi data yang cepat.

```mermaid
graph LR
    subgraph Client-Side (Browser)
        LS[localStorage]
        Drafts[Laporan Drafts]
    end

    subgraph Cloud Backend (Workers & R2)
        API[D1 Serverless Database]
        R2[Cloudflare R2 Bucket]
    end

    %% Login & Sesi
    LS -->|Validasi Peran & Sesi| LS
    
    %% Absensi Karyawan
    LS -->|Ambil Email Karyawan| API
    R2 -->|Tampilkan Foto Selfie| LS
    LS -->|Kamera Selfie & Base64| R2
    
    %% Rapor
    Drafts -->|Auto-save Draft Rapor| LS
```

### A. Struktur Data Lokal (Local Storage Keys)

*   `lkp_user_email`: Email Google pengguna aktif (digunakan sebagai identitas otentikasi).
*   `lkp_user_name`: Nama lengkap pengguna (ditampilkan di header/profil sidebar).
*   `lkp_user_picture`: URL foto profil Google (ditampilkan di avatar sidebar).
*   `lkp_karyawan_name_selected`: Nama karyawan terakhir yang dipilih pada halaman absensi karyawan (agar pilihan tidak hilang saat halaman disegarkan).
*   `laporan_draft_[NamaSiswa]`: Stringified JSON berisi isi draf laporan bulanan siswa tertentu.

### B. Payload Objek Data Utama (JSON API Schema)

#### 1. Data Siswa (`/api/data`)
```json
{
  "id": 124,
  "nama": "Ahmad Dani",
  "nisn": "0098765432",
  "nik": "1603xxxxxxxxxxxx",
  "alamat": "Jl. Merdeka No. 10",
  "penerima_kps": "Tidak",
  "nama_ibu": "Siti Rahma",
  "nama_ayah": "Budi Hartono",
  "nama_wali": "-",
  "program": "Bimbel",
  "instruktur": "Tri Zahara, S.Pd",
  "kelas": "V SD",
  "jadwal": "Senin 15:30, Rabu 16:00",
  "status_spp": "Belum Lunas",
  "created_at": "2026-06-30T10:20:00Z"
}
```

#### 2. Absensi Karyawan (`/api/absensi-karyawan`)
```json
{
  "id": 45,
  "email": "muhammadkhalid@lkp.com",
  "nama": "Muhammad Khalid",
  "tanggal": "2026-06-30",
  "sesi": 1,
  "status": "Hadir",
  "jam_masuk": "07:55",
  "foto_masuk_key": "absen_masuk_khalid_1719759300.jpg",
  "lat_masuk": -3.66721,
  "lng_masuk": 103.77445,
  "jam_pulang": "14:05",
  "foto_pulang_key": "absen_pulang_khalid_1719781500.jpg",
  "lat_pulang": -3.66718,
  "lng_pulang": 103.77441,
  "keterangan": "",
  "edit_note": ""
}
```
