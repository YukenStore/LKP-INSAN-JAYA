# Product Requirement Document (PRD)
## Sistem Manajemen Akademik & Absensi LKP Insan Jaya

---

## 1. Pendahuluan & Latar Belakang

LKP Insan Jaya merupakan lembaga kursus non-formal yang melayani berbagai program belajar seperti bimbingan belajar sekolah (Bimbel), kelas komputer, bahasa Inggris, calistung, bahasa Arab, dan menggambar. 

Sebelum adanya aplikasi ini, pencatatan kehadiran (absensi), status pembayaran bulanan (SPP), pendaftaran siswa baru, dan pembuatan rapor bulanan dilakukan secara manual atau menggunakan lembar sebar (spreadsheet) terpisah. Hal ini menimbulkan potensi ketidaksesuaian data, kesulitan pemantauan status SPP, serta memakan waktu lama dalam pembuatan laporan belajar bulanan bagi orang tua siswa.

### Visi Produk
Membangun portal internal (admin & guru) terpadu yang ringan, cepat, dapat diinstal di ponsel (PWA), untuk mendigitalisasi seluruh administrasi siswa mulai dari pendaftaran, absensi harian, kontrol SPP, hingga penerbitan laporan hasil belajar secara praktis.

---

## 2. Target Pengguna (User Personas)

Sistem ini membagi akses fiturnya berdasarkan 3 kelompok pengguna utama:

1.  **Super Admin (Pemilik Lembaga / Kepala Sekolah)**
    *   *Tujuan*: Memantau seluruh operasional, mengontrol pembayaran SPP siswa, dan melakukan pembersihan (reset) data bulanan untuk siklus akademik baru.
2.  **Admin / Staf Akademik (Registrar / Tata Usaha)**
    *   *Tujuan*: Menerima siswa baru, mengatur penugasan instruktur dan kelas, mengelola database siswa terdaftar, serta menyetujui pendaftaran online.
3.  **Instruktur / Guru**
    *   *Tujuan*: Melakukan presensi kehadiran siswa setiap sesi belajar dan membuat laporan hasil belajar bulanan (rapor) untuk wali murid.

---

## 3. Fitur Utama & Persyaratan Fungsional

### A. Autentikasi Pengguna (Login)
*   **Kebutuhan**: Masuk aman menggunakan Single Sign-On (SSO) Google.
*   **Aturan Bisnis**:
    *   Hanya email Google yang terdaftar dalam sistem yang dapat mengakses fitur operasional (Admin/Guru).
    *   Pengguna dengan email tidak terdaftar tetap dapat login tetapi memiliki akses menu yang sangat terbatas (Non-Staff).
    *   Sesi login harus tetap terjaga (persistent) sehingga pengguna tidak perlu login ulang setiap membuka aplikasi, kecuali jika mereka melakukan *Logout* secara eksplisit.

### B. Dashboard & Database Siswa (Siswa Aktif)
*   **Kebutuhan**: Melihat dan mencari data seluruh siswa aktif di LKP.
*   **Aturan Bisnis**:
    *   Menampilkan ringkasan total siswa aktif dan jumlah siswa yang mendaftar hari ini.
    *   Menyediakan pencarian instan (search bar) berdasarkan nama siswa.
    *   Menyediakan filter bertingkat berdasarkan Program Studi, Instruktur, dan Nama Kelas.
    *   Menampilkan jadwal belajar lengkap (Hari dan Jam).
    *   **Khusus Admin**: Akses tombol untuk mengubah (edit) profil siswa dan menghapus data siswa.

### C. Manajemen Absensi & Kontrol SPP
*   **Kebutuhan**: Pencatatan kehadiran siswa per pertemuan dan validasi pembayaran SPP.
*   **Aturan Bisnis**:
    *   Guru dapat memilih siswa melalui skema drop-down dinamis: Program -> Instruktur -> Siswa.
    *   Mendukung format absensi fleksibel: **8 pertemuan** (program kilat/privat) atau **12 pertemuan** (program reguler bulanan).
    *   Mencatat tanggal dan status kehadiran untuk setiap pertemuan: *Hadir*, *Izin*, *Alfa*, atau *Belum Mengisi*.
    *   **Khusus Super Admin**: Berhak mengubah status SPP siswa menjadi *Lunas* atau *Belum Lunas*.
    *   **Khusus Super Admin**: Menyediakan tombol untuk mereset seluruh data absensi dan SPP siswa ke kondisi awal (bulan baru).

### D. Pendaftaran Siswa & Kelas Baru
*   **Kebutuhan**: Pendaftaran siswa baru secara langsung (offline) dan peninjauan pendaftaran online.
*   **Aturan Bisnis (Manual/Offline)**:
    *   Admin menginputkan biodata siswa, NISN, NIK, alamat, penerima KPS, data orang tua (ibu, ayah, wali), program studi yang dipilih, serta jadwal belajar.
    *   Mendukung input jadwal belajar khusus (misal: Senin jam 15:30, Rabu jam 16:00).
    *   Pendaftaran offline akan langsung membuat akun siswa aktif di database.
*   **Aturan Bisnis (Rekap Online)**:
    *   Sistem menampung data formulir pendaftaran yang dikirim calon siswa lewat web publik.
    *   Admin meninjau kelengkapan berkas, menandai pembayaran formulir sebagai *Lunas*, atau menghapusnya jika terjadi duplikasi.
    *   Jika ada pendaftaran baru yang belum ditinjau, lencana notifikasi merah akan muncul di seluruh halaman admin.

### E. Generator Lapor Belajar Bulanan (Rapor)
*   **Kebutuhan**: Membuat lembar laporan hasil belajar siswa per bulan secara cepat dalam format cetak/gambar.
*   **Aturan Bisnis**:
    *   Guru mengisi program belajar, nama siswa, bulan laporan, catatan perkembangan, serta tabel kompetensi (Materi, Kondisi, dan Hasil Pembelajaran) maksimal 8 baris.
    *   Sistem menyimpan draf secara otomatis ke penyimpanan lokal browser agar data tidak hilang ketika mengetik laporan.
    *   Pratinjau laporan berukuran A4 standar (794 x 1123 px) berdesain resmi LKP dengan tanda tangan instruktur.
    *   Guru dapat mengunduh laporan hasil belajar tersebut dalam format **JPG** untuk dikirimkan secara mandiri ke wali murid melalui WhatsApp.

### F. Absensi Karyawan & Guru
*   **Kebutuhan**: Pencatatan kehadiran harian karyawan/guru secara mandiri dengan verifikasi GPS dan swafoto (selfie), serta portal pemantauan untuk pimpinan/admin.
*   **Aturan Bisnis (Absen Mandiri)**:
    *   Karyawan memilih namanya dari daftar dropdown karyawan LKP.
    *   Mendukung maksimal **2 sesi presensi per hari** (Masuk & Pulang untuk masing-masing sesi).
    *   Verifikasi lokasi GPS mengharuskan karyawan berada dalam radius maksimal **50 meter** dari koordinat kantor LKP Insan Jaya (`-3.66719, 103.77442`).
    *   Karyawan wajib mengunggah foto selfie real-time yang diambil langsung melalui kamera perangkat. Swafoto akan disimpan di Cloudflare R2 bucket.
    *   Menyediakan tampilan riwayat presensi bulanan beserta ringkasan jumlah status kehadiran (*Hadir*, *Izin*, *Sakit*, *Alpha*) karyawan bersangkutan.
*   **Aturan Bisnis (Pantau Karyawan - Khusus Pimpinan)**:
    *   Pengguna dengan peran pimpinan/admin secara otomatis diarahkan ke tab "Pantau Karyawan" (panel absen mandiri disembunyikan).
    *   Pimpinan/admin dapat memantau kehadiran harian seluruh karyawan lengkap dengan jam masuk/pulang, status kehadiran, dan tautan untuk melihat foto selfie verifikasi.
    *   Pimpinan/admin memiliki hak penuh untuk:
        1.  Mengubah (edit) status kehadiran karyawan dengan disertai catatan alasan perubahan (wajib diisi).
        2.  Menghapus data presensi karyawan jika terjadi kesalahan input.
        3.  Menambahkan data presensi karyawan secara manual (untuk kasus izin/sakit atau lupa absen).
    *   Menampilkan rekapitulasi jumlah kehadiran bulanan seluruh karyawan dalam format tabel ringkasan.

---

## 4. Persyaratan Non-Fungsional (NFR)

*   **PWA (Installability)**: Sistem harus memenuhi standar PWA Google Chrome sehingga pengguna (terutama guru) dapat menginstalnya di HP Android/iOS untuk pengisian cepat di kelas.
*   **Kecepatan & Ringan**: Aplikasi tidak boleh menggunakan framework JavaScript yang berat (seperti Angular atau React lengkap) demi mempertahankan kecepatan akses di area dengan jaringan internet kurang stabil.
*   **Keamanan Data**: Autentikasi API dilakukan di sisi server untuk memastikan pengguna yang tidak memiliki hak akses dilarang mengubah database siswa.
*   **Kemampuan Cetak**: Layout pratinjau laporan harus presisi dalam format A4 agar tidak terpotong saat dicetak ke kertas fisik.
