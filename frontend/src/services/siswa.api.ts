
/**
 * SERVICE API SISWA
 *
 * Semua komunikasi HTTP antara React dan Backend
 * diletakkan di file ini.
 */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Siswa {
  kode_siswa: string;
  nama_siswa: string;
  alamat_siswa: string;
  tanggal_lahir: string;
  jurusan_siswa: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateSiswaDTO = Omit<
  Siswa,
  "created_at" | "updated_at"
>;

export type UpdateSiswaDTO = Omit<
  CreateSiswaDTO,
  "kode_siswa"
>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Terjadi kesalahan pada server");
  }

  return result.data as T;
}

/**
 * Mengambil seluruh data siswa.
 */
export async function getAllSiswa(): Promise<Siswa[]> {
  return request<Siswa[]>("/siswa");
}

/**
 * Mengambil satu siswa berdasarkan kode.
 */
export async function getSiswaByKode(
  kode: string,
): Promise<Siswa> {
  return request<Siswa>(`/siswa/${encodeURIComponent(kode)}`);
}

/**
 * Menambahkan siswa baru.
 */
export async function createSiswa(
  data: CreateSiswaDTO,
): Promise<Siswa> {
  return request<Siswa>("/siswa", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Memperbarui data siswa.
 */
export async function updateSiswa(
  kode: string,
  data: UpdateSiswaDTO,
): Promise<Siswa> {
  return request<Siswa>(
    `/siswa/${encodeURIComponent(kode)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Menghapus data siswa.
 */
export async function deleteSiswa(kode: string): Promise<void> {
  await request<undefined>(
    `/siswa/${encodeURIComponent(kode)}`,
    {
      method: "DELETE",
    },
  );
}
