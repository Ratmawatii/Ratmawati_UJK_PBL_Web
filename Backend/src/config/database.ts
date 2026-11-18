
// Mengimpor Pool untuk mengelola koneksi PostgreSQL
import { Pool } from "pg";

// Mengambil konfigurasi database dari environment
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

// Memastikan seluruh konfigurasi database tersedia
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Konfigurasi database belum lengkap!");
}

// Membuat connection pool PostgreSQL
export const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  // Batas waktu koneksi ke database
  connectionTimeoutMillis: 5000,

  // Maksimal koneksi yang dikelola pool
  max: 10,
});

// Menangani error koneksi idle dari PostgreSQL
pool.on("error", (error) => {
  console.error("Database pool error:", error);
});
