<div align="center">
  <img src="https://res.cloudinary.com/alfianmna/image/upload/v1752647748/Group_3157_djmrso.png" alt="Logo Lentera Umat" width="300"/>

  <h2>Lentera Umat: Belajar Tepat, Beramal Hebat, Bersama Umat</h2>
</div>

---

## 📌 About This Project

**Lentera Umat** adalah platform edukasi dan donasi berbasis AI yang menghubungkan masyarakat dengan sumber pembelajaran Islam terpercaya, sekaligus menjadi jembatan donatur untuk menyalurkan bantuan pendidikan ke komunitas yang membutuhkan.

Platform ini dibangun dengan **MERN Stack** dan integrasi **Google Gemini API** untuk fitur AI pembelajaran cerdas dan interaktif.

---

## 👥 Ummah Team

|     NIM     | Name                          |
| :---------: | ----------------------------- |
| 22106050058 | Alfian Maulana                |
| 23106050031 | Faris Jihadi Hanif Lubis      |
| 23106050019 | Zahra Zakila Anindha Rahmanti |
| 23106050022 | Nadine Riskia Windi Paramita  |

---

## 🖼️ Application Result

<div align="center">
  <img src="https://res.cloudinary.com/alfianmna/image/upload/v1752648109/Lentera_Umat_ny5cdr.png" alt="Result App" width="100%"/>
</div>

---

## 🚀 Running Project (Lentera Umat - MERN Stack)

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal di komputer Anda.

### 1️⃣ Clone Repository

```bash
git clone <URL_REPOSITORI_LENTERA_UMMAT_ANDA>
cd lentera-umat-febe
```

> Ganti `<URL_REPOSITORI_LENTERA_UMMAT_ANDA>` dengan URL repositori Git Anda.

---

### 2️⃣ Setup & Jalankan Backend (API)

```bash
cd api
npm install
```

#### 🔐 Konfigurasi `.env` di Backend

Buat file `.env` di dalam folder `api/` dan isi seperti berikut:

```env
PORT=4000
MONGO_URL=mongodb://localhost:27017/lenteraummat (ganti dengan url MongoDB)
SECRET=your_secret_jwt_key_super_aman
```

> ✅ **Catatan:** Anda tidak perlu menempelkan `GEMINI_API_KEY` di backend. Gemini API dipanggil dari frontend.

#### ▶️ Jalankan Server Backend

```bash
npm start
```

Backend akan berjalan di: [http://localhost:4000](http://localhost:4000)

---

### 3️⃣ Setup & Jalankan Frontend (Client)

```bash
cd ../client
npm install
```

#### 🔑 Konfigurasi Gemini API Key di Frontend

1. Buka file `client/src/pages/UmmahPartner.jsx`
2. Temukan bagian kode berikut:

```js
const apiKey = "ganti dengan milikmu";
```

3. Ganti `apiKey` dengan API Key dari [Google AI Studio](https://makersuite.google.com/app)

> ⚠️ Jangan menyimpan API Key di repository publik!

#### 🌐 Jalankan Frontend

```bash
npm run dev
```

Frontend akan tampil di: [http://localhost:5173](http://localhost:5173)

---

## 🧰 Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary
- **AI Integration:** Google Gemini API (via frontend)

---

## 📊 Database Schema (Overview)

- `users` – Data pengguna
- `detailUser` – Informasi Detail pengguna
- `articles` – Artikel pembelajaran
- `ebooks` – E-book & materi digital
- `donations` – Data donasi dari pengguna
- `detaildonasi` – Detail dari setiap item donasi
- `chatsessions` – Riwayat chat AI

---

## 🤝 Contributing

1. Fork repositori ini
2. Buat branch baru: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m "feat: tambahkan fitur baru"`
4. Push ke branch: `git push origin fitur-baru`
5. Buat Pull Request

---

<div align="center">
  ✨ Terima kasih telah menggunakan Lentera Umat ✨  
  <br/>
  <strong>“Belajar Tepat, Beramal Hebat, Bersama Umat.”</strong>
</div>
