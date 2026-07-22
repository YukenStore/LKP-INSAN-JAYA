# Panduan Sinkronisasi Web Tryout Eksternal

Karena aplikasi utama Anda berjalan menggunakan **Cloudflare Workers** sebagai backend-nya (API), cara terbaik untuk menghubungkan Web Tryout Eksternal dengan aplikasi LKP ini adalah menggunakan sistem **REST API (Webhook)**.

## Alur Sinkronisasi (Cara Kerjanya)

1. **Siswa Mengerjakan Soal:** Siswa login dan mengerjakan soal di *Web Khusus Tryout* (misal: ruangguru-clone).
2. **Siswa Klik "Selesai":** Setelah selesai, Web Tryout akan menghitung skor siswa.
3. **Pengiriman Data (Sync):** Secara rahasia di belakang layar, Web Tryout akan mengirimkan *JSON Data* (berisi nama, skor, jawaban benar/salah, dan detail pilihan ganda siswa) ke URL API Cloudflare Anda (misal: `https://api.lkpinsanjaya.workers.dev/api/sync-tryout`).
4. **Data Tersimpan:** Cloudflare Worker Anda menerima data tersebut dan menyimpannya ke database (D1).
5. **Tampil di Dashboard:** Saat Guru membuka menu **Tryout TKA** di aplikasi LKP, Javascript akan mengambil data dari database tersebut, menggantikan data *dummy* yang kita buat tadi.

---

## Prompt AI Siap Pakai

Jika Anda menggunakan AI (seperti ChatGPT, Claude, atau Gemini) untuk membuat Web Tryout Eksternal Anda nanti, **copy-paste teks di bawah ini dan berikan kepada AI tersebut:**

```text
Halo AI, saya sedang membangun sebuah "Web Khusus Tryout" (mirip Ruangguru/Zenius). 
Tugas kamu adalah membuatkan kode Frontend (HTML/JS) dan Backend (Cloudflare Workers) untuk sistem tryout ini.

Ada satu syarat KRUSIAL: Setelah siswa selesai mengerjakan tryout dan menekan tombol "Kumpulkan", web ini HARUS mengirimkan data hasil ujiannya ke sistem utama saya melalui REST API (POST request) agar bisa tersinkronisasi.

Berikut adalah struktur JSON (Payload) yang HARUS dikirimkan ke sistem utama saya saat siswa selesai ujian:

{
  "tryout_id": "TO-001",
  "judul": "Tryout Akbar UTBK SNBT 2026",
  "kategori": "Penalaran Umum & Kognitif",
  "peserta": {
    "id_siswa": "S01",
    "nama": "Ahmad Rizky",
    "statistik": {
      "benar": 1,
      "salah": 1,
      "kosong": 0,
      "skor_total": 500
    },
    "jawaban_detail": {
      "1": "B",
      "2": "C"
    }
  },
  "pembahasan_soal": [
    {
      "no": 1,
      "pertanyaan": "Jika semua burung bisa terbang...",
      "opsiA": "Penguin bisa terbang",
      "opsiB": "Penguin tidak bisa terbang",
      "opsiC": "Sebagian burung...",
      "opsiD": "Semua salah",
      "kunci": "B",
      "penjelasan": "Berdasarkan premis logika silogisme..."
    }
  ]
}

Tugas kamu:
1. Buat UI Web Tryout interaktif.
2. Buat fungsi Javascript `submitTryout()` yang menghitung skor, lalu melakukan `fetch()` dengan method POST mengirim JSON di atas ke endpoint `/api/sync-tryout`.
3. Buatkan juga kode backend Cloudflare Workers untuk endpoint `/api/sync-tryout` tersebut yang akan menyimpan JSON ini ke dalam tabel SQLite (D1) bernama `tryout_results`.
```

## Apa yang harus dilakukan selanjutnya di aplikasi ini?

Saat Web Tryout eksternalnya sudah jadi dan API Cloudflare-nya sudah menerima data, Anda hanya perlu kembali ke file `tryout-tka.html` di aplikasi ini, lalu mengubah bagian ini:

**Dari (Data Dummy):**
```javascript
const MOCK_TRYOUTS = [ { ... } ];
function renderDashboard() { ... }
```

**Menjadi (Data Asli API):**
```javascript
async function renderDashboard() {
    // Meminta data asli dari Cloudflare Workers Anda
    const response = await fetch('https://api.lkpinsanjaya.workers.dev/api/tryout-results');
    const MOCK_TRYOUTS = await response.json();
    
    // Render HTML seperti biasa...
}
```
