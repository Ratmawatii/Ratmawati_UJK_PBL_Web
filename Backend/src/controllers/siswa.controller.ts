
/**
 * CONTROLLER: SISWA
 *
 * Bertanggung jawab menerima HTTP Request dari Client
 * dan mengirimkan HTTP Response.
 *
 * Controller tidak menangani query database secara langsung.
 * Seluruh logika bisnis diteruskan ke SiswaService.
 */

import type { Request, Response } from "express";

import { siswaService } from "../services/siswa.service.js";

import { AppError } from "../errors/app-error.js";

/**
 * Menangani error agar response API memiliki format konsisten.
 */
function handleError(error: unknown, res: Response): void {
  // Jika error berasal dari validasi atau proses bisnis
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  // Jika error tidak dikenal, tampilkan di terminal
  console.error("Terjadi kesalahan pada server:", error);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal server",
  });
}

/**
 * Memastikan parameter kode dari URL berupa string.
 */
function getKodeParam(req: Request): string {
  const kode = req.params.kode;

  if (typeof kode !== "string" || !kode.trim()) {
    throw new AppError("Parameter kode siswa tidak valid", 400);
  }

  return kode.trim();
}

/**
 * Class SiswaController
 * Menangani seluruh endpoint CRUD data siswa.
 */
class SiswaController {

  /**
   * GET /api/siswa
   * Mengambil seluruh data siswa.
   */
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await siswaService.getAllSiswa();

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil seluruh data siswa",
        data,
      });
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * GET /api/siswa/:kode
   * Mengambil satu data siswa berdasarkan kode.
   */
  getByKode = async (req: Request, res: Response): Promise<void> => {
    try {
      // Pastikan kode dari URL berupa string
      const kode = getKodeParam(req);

      const data = await siswaService.getSiswaByKode(kode);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil data siswa",
        data,
      });
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * POST /api/siswa
   * Menambahkan data siswa baru.
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await siswaService.createSiswa(req.body);

      res.status(201).json({
        success: true,
        message: "Data siswa berhasil ditambahkan",
        data,
      });
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * PUT /api/siswa/:kode
   * Memperbarui data siswa berdasarkan kode.
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      // Pastikan kode dari URL berupa string
      const kode = getKodeParam(req);

      const data = await siswaService.updateSiswa(kode, req.body);

      res.status(200).json({
        success: true,
        message: "Data siswa berhasil diperbarui",
        data,
      });
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * DELETE /api/siswa/:kode
   * Menghapus data siswa berdasarkan kode.
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      // Pastikan kode dari URL berupa string
      const kode = getKodeParam(req);

      await siswaService.deleteSiswa(kode);

      res.status(200).json({
        success: true,
        message: "Data siswa berhasil dihapus",
      });
    } catch (error) {
      handleError(error, res);
    }
  };
}

/**
 * Mengekspor instance Controller agar bisa digunakan Router.
 */
export const siswaController = new SiswaController();
