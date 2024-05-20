# Colle - Tanya Jawab

## Deskripsi
Colle - Tanya Jawab adalah sebuah aplikasi yang memungkinkan pengguna untuk berbagi pertanyaan dan jawaban secara kolaboratif. Aplikasi ini memanfaatkan teknologi Next.js Fullstack, MongoDB sebagai basis data, dan TypeScript untuk pengembangan.

Proyek ini melibatkan tim pengembang yang terdiri dari:
- Muhammad Deo Audha Rizki
- Fardan Al Jihad
- Tabitha Salsabila Permana
- Reka Briyan Cahya Heryana
- Suci Awalia Gardara
- Muhammad Fikri Hidayatulloh

## Teknologi yang Digunakan
<p align="left">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Next JS" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="Typescript" width="40" height="40"/>
</p>

## Prasyarat
- **Node.js:** Pastikan Anda telah menginstal Node.js di sistem Anda. Anda dapat mengunduhnya dari [nodejs.org](https://nodejs.org/). Versi yang direkomendasikan: **20.12.2**
- **Next.js:** Pastikan Anda telah menginstal Next.js. Jika belum, Anda dapat menginstalnya menggunakan npm dengan perintah `npm install -g next`. Versi yang direkomendasikan: **14.0.1**
- **TypeScript:** Pastikan Anda telah menginstal TypeScript. Jika belum, Anda dapat menginstalnya menggunakan npm dengan perintah `npm install -g typescript`. Versi yang direkomendasikan: **5**
- **MongoDB:** Pastikan Anda telah menginstal MongoDB di sistem Anda. Anda dapat mengunduhnya dari [mongodb.com](https://www.mongodb.com/try/download/community). Versi yang direkomendasikan: **7.0.9**
- Buat akun TinyMCE di situs web resmi [TinyMCE](https://www.tiny.cloud/).
- Buat akun Clerk di situs web resmi [Clerk](https://clerk.com/).
- Pastikan Anda telah menginstal dan menjalankan dashboard [Collaborative Learning](https://github.com/farizibnu/collaborative-learning).

## Cara Install Colle Tanya Jawab
1. Buka terminal.
2. Clone repository ini.
   ```
   git clone https://github.com/deo23/proyek3-tanya-jawab.git
   ```
3. Masuk ke direktori repository yang telah di-clone.
   ```
   cd proyek3-tanya-jawab
   ```
4. Install dependencies menggunakan npm.
   ```
   npm install
   ```
5. Buat file `.env` pada direktori root proyek Colle - Tanya Jawab. Isilah file tersebut dengan konfigurasi berikut:
    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Your Key>
    CLERK_SECRET_KEY=<Your Key>
    NEXT_CLERK_WEBHOOK_SECRET=<Your Key>
    NEXT_PUBLIC_TINY_MCE_API_KEY=<Your Key>
    MONGODB_URL=mongodb://127.0.0.1:27017
    NEXTAUTH_URL=http://localhost:3001/
    NEXTAUTH_SECRET=secret
    ALLOWED_ORIGIN="http://localhost:3000"
    NEXT_PUBLIC_DASHBOARD_URL="http://localhost:8080"
    NEXT_PUBLIC_DASHBOARDHOME_URL="http://localhost:3000/"
    ```

## Cara Menjalankan Colle Tanya Jawab
1. Pastikan semua prasyarat terpenuhi dan dashboard Collaborative Learning sudah berjalan, serta Anda telah masuk ke dashboard.
2. Buka terminal.
3. Masuk ke direktori repository Colle Tanya Jawab.
   ```
   cd proyek3-tanya-jawab
   ```
4. Jalankan perintah berikut untuk memulai aplikasi.
   ```
   npm run dev
   ```
5. Buka browser dan akses `http://localhost:3001/`.

## Schema Diagram
![Schema Diagram](https://github.com/deo23/colle-tanya-jawab/blob/main/Readme%20Image/Schema-Diagram.png)

## Struktur Folder Proyek
```
colle-tanya-jawab
├─ app
│  ├─ (auth)           
│  ├─ (root)           
│  ├─ api                  
├─ components
│  ├─ cards            
│  ├─ forms            
│  ├─ shared           
│  └─ ui               
├─ constants           
├─ database            
├─ lib                 
├─ public              
├─ styles              
├─ context
├─ middleware.ts       
├─ next.config.js      
├─ package.json        
├─ tsconfig.json
```
- **app:** Berisi struktur halaman utama dan API endpoint untuk aplikasi.
- **components:** Menyimpan berbagai komponen yang dapat digunakan ulang dalam aplikasi.
- **constants:** Menyimpan konstanta yang sering digunakan dalam kode.
- **database:** Model database menggunakan Mongoose untuk MongoDB.
- **lib:** Utilitas dan fungsi umum yang mendukung aplikasi.
- **public:** Aset publik yang dapat diakses langsung dari URL.
- **styles:** File CSS untuk styling aplikasi.
- **context:** Konteks React untuk manajemen state global, seperti tema.
- **middleware.ts:** Middleware khusus untuk Next.js.
- **next.config.js:** Konfigurasi aplikasi Next.js.
- **package.json:** Berisi metadata proyek dan daftar dependensi.
- **tsconfig.json:** Konfigurasi untuk TypeScript.

## Troubleshooting Guide
### ID undefined pada page home
Jika ID undefined pada page home, lakukan beberapa hal berikut:
- Refresh halaman
- Delete document user yang saat ini sedang login. Sebagai contoh, jika login menggunakan user A, maka delete terlebih dahulu user A pada database.
- Lakukan clean database dengan menghapus keseluruhan database Colle-Tanya-Jawab.

## Referensi tambahan
DevOverflow: [https://github.com/rakibtweets/dev_overflow_nextjs13](https://github.com/rakibtweets/dev_overflow_nextjs13)
