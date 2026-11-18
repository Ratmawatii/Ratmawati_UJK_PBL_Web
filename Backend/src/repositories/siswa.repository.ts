
import { pool } from "../config/database.js";

import type {
  Siswa,
  CreateSiswaDTO,
  UpdateSiswaDTO,
} from "../types/siswa.types.js";

/**
 * Repository untuk mengelola seluruh query database siswa.
 */
class SiswaRepository {

  /**
   * Mengambil seluruh data siswa.
   */
  async findAll(): Promise<Siswa[]> {
    const result = await pool.query(
      `SELECT * FROM siswa ORDER BY kode_siswa ASC`
    );

    return result.rows as Siswa[];
  }

  /**
   * Mengambil satu siswa berdasarkan kode siswa.
   */
  async findByKode(kode: string): Promise<Siswa | null> {
    const result = await pool.query(
      `SELECT * FROM siswa WHERE kode_siswa = $1`,
      [kode]
    );

    return (result.rows[0] as Siswa) || null;
  }

  /**
   * Menambahkan data siswa baru.
   */
  async create(data: CreateSiswaDTO): Promise<Siswa> {
    const result = await pool.query(
      `INSERT INTO siswa (
        kode_siswa,
        nama_siswa,
        alamat_siswa,
        tanggal_lahir,
        jurusan_siswa
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        data.kode_siswa,
        data.nama_siswa,
        data.alamat_siswa,
        data.tanggal_lahir,
        data.jurusan_siswa,
      ]
    );

    return result.rows[0] as Siswa;
  }

  /**
   * Memperbarui data siswa berdasarkan kode.
   */
  async update(
    kode: string,
    data: UpdateSiswaDTO
  ): Promise<Siswa | null> {
    const result = await pool.query(
      `UPDATE siswa
       SET
         nama_siswa = $1,
         alamat_siswa = $2,
         tanggal_lahir = $3,
         jurusan_siswa = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE kode_siswa = $5
       RETURNING *`,
      [
        data.nama_siswa,
        data.alamat_siswa,
        data.tanggal_lahir,
        data.jurusan_siswa,
        kode,
      ]
    );

    return (result.rows[0] as Siswa) || null;
  }

  /**
   * Menghapus data siswa berdasarkan kode.
   */
  async delete(kode: string): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM siswa WHERE kode_siswa = $1`,
      [kode]
    );

    return (result.rowCount ?? 0) > 0;
  }
}

// Mengekspor instance repository agar dapat digunakan Service
export const siswaRepository = new SiswaRepository();
