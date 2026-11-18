
/**
 * Interface Siswa
 * Mendefinisikan struktur data siswa yang berasal dari database.
 */
export interface Siswa {
  kode_siswa: string;
  nama_siswa: string;
  alamat_siswa: string;
  tanggal_lahir: string;
  jurusan_siswa: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Interface CreateSiswaDTO
 * Digunakan ketika frontend mengirimkan data siswa baru.
 *
 * DTO = Data Transfer Object.
 * Hanya berisi data yang dibutuhkan untuk membuat siswa.
 */
export interface CreateSiswaDTO {
  kode_siswa: string;
  nama_siswa: string;
  alamat_siswa: string;
  tanggal_lahir: string;
  jurusan_siswa: string;
}

/**
 * Interface UpdateSiswaDTO
 * Digunakan ketika frontend mengubah data siswa.
 */
export interface UpdateSiswaDTO {
  nama_siswa: string;
  alamat_siswa: string;
  tanggal_lahir: string;
  jurusan_siswa: string;
}
