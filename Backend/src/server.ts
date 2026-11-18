
// Memuat konfigurasi environment dari file .env
import "dotenv/config";

// Mengimpor aplikasi Express
import app from "./app.js";

// Mengimpor koneksi PostgreSQL
import { pool } from "./config/database.js";

// Mengambil port dari environment atau menggunakan 3000
const PORT = Number(process.env.PORT) || 3000;

// Fungsi utama untuk menjalankan server
const startServer = async (): Promise<void> => {
  try {
    // Memastikan database dapat diakses
    await pool.query("SELECT NOW()");

    console.log("Koneksi PostgreSQL berhasil!");

    // Menjalankan server Express
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    // Menampilkan error jika koneksi database gagal
    console.error("Gagal menjalankan server:", error);

    // Menghentikan proses aplikasi jika startup gagal
    process.exit(1);
  }
};

// Memulai aplikasi
startServer();
