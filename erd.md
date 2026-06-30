# Entity Relationship Diagram (ERD) - LKP Insan Jaya

Berikut adalah struktur basis data (ERD) dari aplikasi LKP Insan Jaya beserta relasi antar tabelnya, berdasarkan implementasi backend (Cloudflare D1 Worker).

```mermaid
erDiagram
    %% ENTITIES
    
    pendaftaran_online {
        INTEGER id PK
        TEXT nama_lengkap
        TEXT jenis_kelamin
        TEXT nisn
        TEXT nik
        TEXT tempat_lahir
        TEXT tanggal_lahir
        TEXT agama
        TEXT alamat
        TEXT kewarganegaraan
        TEXT nama_ibu
        TEXT pekerjaan_ibu
        TEXT penghasilan_ibu
        TEXT tahun_lahir_ibu
        TEXT nama_ayah
        TEXT pekerjaan_ayah
        TEXT program
        TEXT waktu_belajar
        TEXT no_handphone
        TEXT status "DEFAULT 'Belum Lunas'"
        DATETIME waktu_daftar
    }

    kelas {
        INTEGER id PK
        TEXT program
        TEXT nama_kelas
        TEXT guru
        TEXT jadwal
    }

    absensi ||--o{ absensi_detail : "memiliki"
    absensi ||--o{ laporan_draft : "memiliki"
    
    absensi {
        INTEGER id PK
        TEXT nama_siswa
        TEXT program
        TEXT kelas
        TEXT guru
        TEXT jadwal
        TEXT status_spp "DEFAULT 'Belum Lunas'"
        INTEGER format_absen "DEFAULT 12"
        DATETIME waktu_input
    }

    absensi_detail {
        INTEGER id PK
        INTEGER siswa_id FK
        INTEGER pertemuan_ke
        TEXT status
        TEXT bulan
        TEXT tanggal
    }

    tanggal_pertemuan {
        INTEGER id PK
        TEXT jadwal
        TEXT bulan
        INTEGER pertemuan_ke
        TEXT tanggal
    }

    absensi_karyawan {
        INTEGER id PK
        TEXT email
        TEXT nama
        TEXT tanggal
        INTEGER sesi
        TEXT status
        TEXT jam_masuk
        TEXT jam_pulang
        TEXT keterangan
        TEXT foto_masuk_key
        TEXT foto_pulang_key
        REAL lat_masuk
        REAL lng_masuk
        TEXT edited_by
    }

    laporan_draft {
        TEXT siswa_id FK
        TEXT user_email PK
        TEXT draft_data
    }

    %% RELATIONSHIP NOTES
    %% Tabel `kelas` dan `tanggal_pertemuan` direlasikan secara tidak langsung menggunakan field `jadwal`.
    %% Tabel `kelas` dan `absensi` direlasikan secara tidak langsung menggunakan field `kelas`, `guru`, dan `jadwal`.
```

## Penjelasan Tabel Utama

1. **pendaftaran_online**: Tabel yang menyimpan data registrasi siswa baru dari formulir pendaftaran mandiri.
2. **kelas**: Menyimpan master data kelas beserta program, nama kelas, guru pengajar, dan jadwal belajarnya.
3. **absensi** (Data Siswa Aktif): Menyimpan identitas siswa yang sudah aktif belajar beserta kelas dan tagihan SPP-nya. Bertindak sebagai tabel master untuk data akademik siswa.
4. **absensi_detail**: Menyimpan rekam jejak presensi/kehadiran siswa pada setiap sesi pertemuan (1-12 atau 1-8).
5. **tanggal_pertemuan**: Menyimpan catatan tanggal riil dari setiap pertemuan (pertemuan 1 tanggal sekian, pertemuan 2 tanggal sekian) berdasarkan sebuah jadwal.
6. **absensi_karyawan**: Menyimpan rekam jejak presensi harian karyawan lengkap dengan koordinat lokasi (GPS), foto bukti kehadiran, jam masuk, jam pulang, dan status (Hadir, Izin, Sakit, Alpha).
7. **laporan_draft**: Tabel sementara (temp) untuk menyimpan isian draf *Laporan Hasil Belajar* sebelum disubmit secara permanen.
