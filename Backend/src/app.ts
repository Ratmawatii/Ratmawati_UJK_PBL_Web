// Mengimpor Express
import express from "express";

// Mengimpor CORS
import cors from "cors";

// Mengimpor routes siswa
import siswaRoutes from "./routes/siswa.routes.js";

// Membuat instance aplikasi Express
const app = express();

// Mengizinkan komunikasi lintas origin
app.use(cors());

// Membaca request JSON
app.use(express.json());

// Endpoint utama untuk mengecek kondisi API
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API Data Siswa berhasil dijalankan!",
  });
});

// Mendaftarkan seluruh endpoint siswa
app.use("/api/siswa", siswaRoutes);

// Mengekspor aplikasi
export default app;
