/**
 * SERVICE: SISWA
 *
 * Bertanggung jawab menangani seluruh logika bisnis
 * yang berkaitan dengan data siswa.
 *
 * Service menjadi penghubung antara Controller
 * dan Repository.
 */

import { siswaRepository } from "../repositories/siswa.repository.js";

import { AppError } from "../errors/app-error.js";

import type {
  Siswa,
  CreateSiswaDTO,
  UpdateSiswaDTO,
} from "../types/siswa.types.js";

/**
 * Class SiswaService
 * Berisi seluruh proses bisnis CRUD data siswa.
 */
class SiswaService {

  /**
   * Mengambil seluruh data siswa dari database.
   */
  async getAllSiswa(): Promise<Siswa[]> {
    return await siswaRepository.findAll();
  }

  /**
   * Mengambil satu data siswa berdasarkan kode siswa.
   *
   * @param kode - Kode siswa yang dicari
   */
  async getSiswaByKode(kode: string): Promise<Siswa> {

    // Mencari siswa melalui Repository
    const siswa = await siswaRepository.findByKode(kode);

    // Jika siswa tidak ditemukan, kirim error 404
    if (!siswa) {
      throw new AppError("Data siswa tidak ditemukan", 404);
    }

    return siswa;
  }

  /**
   * Memvalidasi seluruh data wajib siswa.
   *
   * @param data - Data yang akan divalidasi
   */
  private validateData(data: {
    nama_siswa: string;
    alamat_siswa: string;
    tanggal_lahir: string;
    jurusan_siswa: string;
  }): void {

    // Menampung seluruh field yang wajib diisi
    const requiredFields = [
      data.nama_siswa,
      data.alamat_siswa,
      data.tanggal_lahir,
      data.jurusan_siswa,
    ];

    // Memastikan tidak ada field yang kosong
    if (requiredFields.some((value) => !value?.trim())) {
      throw new AppError("Semua data siswa wajib diisi", 400);
    }

    // Memastikan format tanggal adalah YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_lahir)) {
      throw new AppError(
        "Format tanggal harus YYYY-MM-DD",
        400
      );
    }

    // Memeriksa apakah tanggal benar-benar valid
    const date = new Date(`${data.tanggal_lahir}T00:00:00Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== data.tanggal_lahir
    ) {
      throw new AppError("Tanggal lahir tidak valid", 400);
    }
  }

  /**
   * Menambahkan data siswa baru.
   *
   * @param data - Data siswa yang akan ditambahkan
   */
  async createSiswa(data: CreateSiswaDTO): Promise<Siswa> {

    // Memastikan kode siswa tersedia
    if (!data.kode_siswa?.trim()) {
      throw new AppError("Kode siswa wajib diisi", 400);
    }

    // Membersihkan spasi pada kode siswa
    const kodeSiswa = data.kode_siswa.trim();

    // Memastikan panjang kode tidak melebihi batas database
    if (kodeSiswa.length > 20) {
      throw new AppError(
        "Kode siswa maksimal 20 karakter",
        400
      );
    }

    // Memeriksa apakah kode siswa sudah digunakan
    const existingSiswa = await siswaRepository.findByKode(
      kodeSiswa
    );

    if (existingSiswa) {
      throw new AppError(
        "Kode siswa sudah digunakan",
        409
      );
    }

    // Membentuk data baru dengan membersihkan spasi
    const cleanData: CreateSiswaDTO = {
      kode_siswa: kodeSiswa,
      nama_siswa: data.nama_siswa?.trim(),
      alamat_siswa: data.alamat_siswa?.trim(),
      tanggal_lahir: data.tanggal_lahir,
      jurusan_siswa: data.jurusan_siswa?.trim(),
    };

    // Memvalidasi data sebelum disimpan
    this.validateData(cleanData);

    // Menyimpan data melalui Repository
    return await siswaRepository.create(cleanData);
  }

  /**
   * Memperbarui data siswa berdasarkan kode.
   *
   * @param kode - Kode siswa yang akan diperbarui
   * @param data - Data baru siswa
   */
  async updateSiswa(
    kode: string,
    data: UpdateSiswaDTO
  ): Promise<Siswa> {

    // Memastikan siswa yang akan diedit tersedia
    await this.getSiswaByKode(kode);

    // Membersihkan spasi pada data yang diterima
    const cleanData: UpdateSiswaDTO = {
      nama_siswa: data.nama_siswa?.trim(),
      alamat_siswa: data.alamat_siswa?.trim(),
      tanggal_lahir: data.tanggal_lahir,
      jurusan_siswa: data.jurusan_siswa?.trim(),
    };

    // Memvalidasi data sebelum melakukan update
    this.validateData(cleanData);

    // Memperbarui data melalui Repository
    const updatedSiswa = await siswaRepository.update(
      kode,
      cleanData
    );

    // Memastikan proses update berhasil
    if (!updatedSiswa) {
      throw new AppError(
        "Gagal memperbarui data siswa",
        500
      );
    }

    return updatedSiswa;
  }

  /**
   * Menghapus data siswa berdasarkan kode.
   *
   * @param kode - Kode siswa yang akan dihapus
   */
  async deleteSiswa(kode: string): Promise<void> {

    // Memastikan siswa tersedia sebelum dihapus
    await this.getSiswaByKode(kode);

    // Menghapus data melalui Repository
    await siswaRepository.delete(kode);
  }
}

/**
 * Mengekspor instance SiswaService
 * agar dapat digunakan oleh Controller.
 */
export const siswaService = new SiswaService();
