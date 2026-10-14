# 📚 Aplikasi Belajar Interaktif SD (Daerah 3T)

> **Platform Pembelajaran Edukasi Gamifikasi Terdesentralisasi & Offline-First untuk Anak Sekolah Dasar di Daerah Terdepan, Terluar, dan Tertinggal (3T).**

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5-purple.svg)
![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-orange.svg)

---

##  Latar Belakang & Solusi

Akses pendidikan di wilayah **3T (Terdepan, Terluar, dan Tertinggal)** di Indonesia sering kali terkendala oleh keterbatasan infrastruktur internet dan jaringan seluler yang tidak stabil. Kebanyakan platform pembelajaran digital saat ini membutuhkan koneksi internet berkecepatan tinggi secara terus-menerus.

**Aplikasi Belajar SD 3T** hadir sebagai solusi berbasis web yang menggabungkan metode gamifikasi interaktif ala *Duolingo* dengan arsitektur **Offline-First**. Seluruh konten kurikulum, gambar, dan progress pembelajaran disimpan secara lokal di perangkat pengguna melalui **IndexedDB**, sehingga anak-anak tetap dapat belajar tanpa gangguan kuota atau sinyal internet.

---

##  Fitur Utama

-  **Offline-First & PWA Supported**: Cukup diakses sekali saat online, aplikasi dan seluruh datanya tersimpan di browser/perangkat dan dapat dibuka 100% tanpa jaringan internet.
-  **Mekanisme Gamifikasi Belajar**:
  - **Experience Points (XP)**: Pengguna mendapatkan poin setiap kali menyelesaikan latihan soal.
  - **Streak Harian**: Mendorong konsistensi belajar anak setiap hari.
  - **Level Progress**: Sistem kenaikan level otomatis berdasarkan total XP yang didapatkan.
-  **Peta Pembelajaran Interaktif (Learning Path)**: Jalur modul belajar berurutan yang membuka bab baru secara bertahap.
-  **Kurikulum Kontekstual 3T**:
  - **Matematika Dasar**: Penjumlahan, pengurangan, perkalian, dan soal cerita bernuansa kehidupan lokal.
  - **Bahasa Indonesia**: Membaca, struktur kalimat sederhana, dan kosa kata dasar.
  - **IPA Dasar**: Pengenalan lingkungan alam, flora, fauna, dan fenomena sekitar.
-  **UI/UX Ramah Anak**: Antarmuka visual yang responsif, penuh warna, dan dilengkapi umpan balik (*feedback*) visual hijau/merah secara langsung saat anak memilih jawaban.

---

##  Tech Stack & Arsitektur

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js + Vite | Framework komponen UI yang cepat dan responsif |
| **Local Database** | Dexie.js (IndexedDB) | Penyimpanan progress belajar, XP, dan status soal secara lokal |
| **State Management** | React Hooks & Dexie Live Query | Pembaruan data *real-time* tanpa re-fetch server |
| **Styling** | Custom CSS | Tampilan interaktif, ringan, dan cepat dimuat |
| **Deployment** | Vercel | Hosting aplikasi web publik |

---

##  Struktur Direktori Project

```text
aplikasi-belajar-sd/
├── public/                # Asset statis (icon, favicon, manifes PWA)
├── src/
│   ├── assets/            # File media/gambar pendukung
│   ├── components/        # Komponen UI modular
│   │   ├── LessonList.jsx    # Peta jalur belajar (Roadmap)
│   │   ├── ProgressBar.jsx   # Indikator progress, XP, dan level
│   │   └── QuestionCard.jsx  # Kartu latihan soal & feedback interaktif
│   ├── data/
│   │   └── lessons.js        # Dataset kurikulum & bank soal lokal
│   ├── db/
│   │   └── db.js             # Skema IndexedDB menggunakan Dexie.js
│   ├── utils/
│   │   └── gamification.js   # Logika kalkulasi level, XP, dan streak
│   ├── App.jsx            # Komponen utama & pengatur state
│   ├── main.jsx           # Entry point aplikasi
│   └── styles.css         # Styling global aplikasi
├── index.html             # Template HTML utama
├── vercel.json            # Konfigurasi routing deployment Vercel
├── vite.config.js         # Konfigurasi bundler Vite & PWA
└── package.json           # Dependensi project & script