import { Router } from "express";

import { siswaController } from "../controllers/siswa.controller.js";

// Membuat router khusus endpoint siswa
const router = Router();

// Mengambil seluruh data siswa
router.get("/", siswaController.getAll);

// Mengambil satu siswa berdasarkan kode
router.get("/:kode", siswaController.getByKode);

// Menambahkan siswa baru
router.post("/", siswaController.create);

// Memperbarui data siswa
router.put("/:kode", siswaController.update);

// Menghapus siswa
router.delete("/:kode", siswaController.delete);

// Mengekspor router agar dapat dipasang di app.ts
export default router;
