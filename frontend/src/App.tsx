
import { useEffect, useMemo, useState, type FormEvent } from "react";
import "./App.css";

import {
  getAllSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  type Siswa,
  type CreateSiswaDTO,
} from "./services/siswa.api";

const emptyForm: CreateSiswaDTO = {
  kode_siswa: "",
  nama_siswa: "",
  alamat_siswa: "",
  tanggal_lahir: "",
  jurusan_siswa: "",
};

function App() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [form, setForm] = useState<CreateSiswaDTO>(emptyForm);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKode, setEditingKode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState("Data Siswa");

  // Mengambil data siswa dari backend.
  async function loadSiswa() {
    try {
      setError("");
      setLoading(true);

      const data = await getAllSiswa();
      setSiswa(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data siswa",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSiswa();
  }, []);

  // Pencarian berdasarkan kode, nama, alamat, dan jurusan.
  const filteredSiswa = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return siswa.filter((item) =>
      [
        item.kode_siswa,
        item.nama_siswa,
        item.alamat_siswa,
        item.jurusan_siswa,
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [siswa, search]);

  const totalJurusan = new Set(
    siswa.map((item) => item.jurusan_siswa),
  ).size;

  // Membuka formulir tambah siswa.
  function openAddModal() {
    setEditingKode(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  // Membuka formulir edit dengan data yang dipilih.
  function openEditModal(item: Siswa) {
    setEditingKode(item.kode_siswa);
    setForm({
      kode_siswa: item.kode_siswa,
      nama_siswa: item.nama_siswa,
      alamat_siswa: item.alamat_siswa,
      tanggal_lahir: item.tanggal_lahir.slice(0, 10),
      jurusan_siswa: item.jurusan_siswa,
    });
    setModalOpen(true);
  }

  // Menutup modal dan mengembalikan formulir ke kondisi awal.
  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingKode(null);
    setForm(emptyForm);
  }

  // Menyimpan data baru atau memperbarui data melalui API.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingKode) {
        await updateSiswa(editingKode, {
          nama_siswa: form.nama_siswa.trim(),
          alamat_siswa: form.alamat_siswa.trim(),
          tanggal_lahir: form.tanggal_lahir,
          jurusan_siswa: form.jurusan_siswa,
        });
      } else {
        await createSiswa({
          ...form,
          kode_siswa: form.kode_siswa.trim(),
          nama_siswa: form.nama_siswa.trim(),
          alamat_siswa: form.alamat_siswa.trim(),
        });
      }

      setModalOpen(false);
      setEditingKode(null);
      setForm(emptyForm);

      await loadSiswa();

      window.alert(
        editingKode
          ? "Data siswa berhasil diperbarui! 💗"
          : "Data siswa berhasil ditambahkan! 💗",
      );
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Gagal menyimpan data siswa",
      );
    } finally {
      setSaving(false);
    }
  }

  // Menghapus data siswa melalui API.
  async function handleDelete(kode: string) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus siswa ${kode}?`,
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteSiswa(kode);
      await loadSiswa();
      window.alert("Data siswa berhasil dihapus!");
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Gagal menghapus data siswa",
      );
    }
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <span>✿</span>
          </div>

          <div className="brand-copy">
            <h2>Bloom<span>School</span></h2>
            <p>STUDENT MANAGEMENT</p>
          </div>
        </div>

        <div className="sidebar-label">MENU UTAMA</div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeMenu === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("Dashboard")}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeMenu === "Data Siswa" ? "active" : ""}`}
            onClick={() => setActiveMenu("Data Siswa")}
          >
            <span className="nav-icon">♡</span>
            <span>Data Siswa</span>
            <span className="nav-count">{siswa.length}</span>
          </button>

          <button
            className={`nav-item ${activeMenu === "Jurusan" ? "active" : ""}`}
            onClick={() => setActiveMenu("Jurusan")}
          >
            <span className="nav-icon">▤</span>
            <span>Jurusan</span>
          </button>
        </nav>

        <div className="sidebar-label sidebar-label-second">
          PREFERENSI
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeMenu === "Pengaturan" ? "active" : ""}`}
            onClick={() => setActiveMenu("Pengaturan")}
          >
            <span className="nav-icon">⚙</span>
            <span>Pengaturan</span>
          </button>
        </nav>

        <div className="sidebar-decoration">
          <span className="decoration-flower">✿</span>
          <p>Little steps,</p>
          <strong>big dreams.</strong>
          <span className="decoration-sparkle">✧</span>
        </div>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">♡</div>
            <div>
              <strong>Need some help?</strong>
              <p>Hubungi administrator jika membutuhkan bantuan.</p>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">AA</div>
            <div className="profile-info">
              <strong>Administrator</strong>
              <span>Super Admin</span>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <div className="breadcrumb">
              Home <span>/</span> <strong>{activeMenu}</strong>
            </div>
            <h1>{activeMenu}</h1>
          </div>

          <div className="topbar-right">
            <div className="date-display">
              <span>♡</span>
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <button
              className="notification-button"
              aria-label="Notifikasi"
              title="Notifikasi"
            >
              ♧
              <span />
            </button>

            <div className="top-avatar">AA</div>
          </div>
        </header>

        <section className="page-content">
          {/* WELCOME BANNER */}
          <section className="welcome-banner">
            <div className="welcome-copy">
              <span className="welcome-label">HELLO, ADMINISTRATOR ✨</span>
              <h2>Make today a<br />beautiful day!</h2>
              <p>
                Selamat datang kembali. Yuk, kelola data siswa
                dengan lebih mudah dan menyenangkan.
              </p>

              <button className="primary-button" onClick={openAddModal}>
                <span>＋</span>
                Tambah Siswa
              </button>
            </div>

            <div className="welcome-art" aria-hidden="true">
              <div className="art-circle art-circle-one" />
              <div className="art-circle art-circle-two" />
              <div className="art-sparkle sparkle-one">✦</div>
              <div className="art-sparkle sparkle-two">✧</div>
              <div className="art-flower">✿</div>
              <div className="art-heart">♡</div>
              <div className="art-card">
                <span className="art-card-icon">♡</span>
                <strong>Bloom with</strong>
                <strong>confidence!</strong>
                <small>Every student matters.</small>
              </div>
            </div>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-banner">
              <span>!</span>
              <div>
                <strong>Oops, ada kendala!</strong>
                <p>{error}</p>
              </div>
              <button onClick={() => void loadSiswa()}>Coba lagi</button>
            </div>
          )}

          {/* STATISTICS */}
          <section className="section-heading">
            <div>
              <span className="section-kicker">YOUR OVERVIEW</span>
              <h2>School at a glance <span>♡</span></h2>
            </div>
            <span className="live-indicator">
              <span /> Live data
            </span>
          </section>

          <div className="stats-grid">
            <article className="stat-card stat-pink">
              <div className="stat-top">
                <div className="stat-icon">♡</div>
                <span className="stat-tag">Students</span>
              </div>
              <p>Total Siswa</p>
              <h3>{loading ? "..." : siswa.length}</h3>
              <div className="stat-bottom">
                <span className="stat-line" />
                <span>Seluruh siswa terdaftar</span>
              </div>
              <span className="stat-watermark">♡</span>
            </article>

            <article className="stat-card stat-purple">
              <div className="stat-top">
                <div className="stat-icon">✿</div>
                <span className="stat-tag">Programs</span>
              </div>
              <p>Total Jurusan</p>
              <h3>{loading ? "..." : totalJurusan}</h3>
              <div className="stat-bottom">
                <span className="stat-line" />
                <span>Jurusan dengan siswa aktif</span>
              </div>
              <span className="stat-watermark">✿</span>
            </article>

            <article className="stat-card stat-peach">
              <div className="stat-top">
                <div className="stat-icon">✓</div>
                <span className="stat-tag">Connection</span>
              </div>
              <p>Status Sistem</p>
              <h3 className={error ? "status-error" : "status-active"}>
                {loading ? "Memuat" : error ? "Gangguan" : "Aktif"}
              </h3>
              <div className="stat-bottom">
                <span className="stat-line" />
                <span>API & PostgreSQL</span>
              </div>
              <span className="stat-watermark">✧</span>
            </article>
          </div>

          {/* STUDENT TABLE */}
          <section className="table-card">
            <div className="table-heading">
              <div>
                <span className="section-kicker">STUDENT DIRECTORY</span>
                <h3>Our lovely students <span>♡</span></h3>
                <p>Semua data siswa tersimpan dan dikelola di sini.</p>
              </div>

              <button className="secondary-button" onClick={openAddModal}>
                <span>＋</span> Tambah Data
              </button>
            </div>

            <div className="table-toolbar">
              <div className="result-count">
                Menampilkan <strong>{filteredSiswa.length}</strong> dari{" "}
                <strong>{siswa.length}</strong> siswa
              </div>

              <div className="search-box">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Cari nama, kode, atau jurusan..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && (
                  <button
                    className="clear-search"
                    onClick={() => setSearch("")}
                    aria-label="Hapus pencarian"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>KODE SISWA</th>
                    <th>NAMA SISWA</th>
                    <th>ALAMAT</th>
                    <th>TANGGAL LAHIR</th>
                    <th>JURUSAN</th>
                    <th className="action-heading">AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        <div className="empty-icon">♡</div>
                        <strong>Sedang mengambil data...</strong>
                        <p>Mohon tunggu sebentar ya.</p>
                      </td>
                    </tr>
                  ) : filteredSiswa.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        <div className="empty-icon">⌕</div>
                        <strong>Data belum ditemukan</strong>
                        <p>Coba gunakan kata kunci pencarian lainnya.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSiswa.map((item, index) => (
                      <tr key={item.kode_siswa}>
                        <td>
                          <span className="student-code">
                            {item.kode_siswa}
                          </span>
                        </td>

                        <td>
                          <div className="student-name">
                            <div className={`student-avatar avatar-${index % 4}`}>
                              {item.nama_siswa.charAt(0).toUpperCase()}
                            </div>
                            <strong>{item.nama_siswa}</strong>
                          </div>
                        </td>

                        <td className="address-cell">
                          {item.alamat_siswa}
                        </td>

                        <td>
                          {new Date(
                            `${item.tanggal_lahir.slice(0, 10)}T00:00:00`,
                          ).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td>
                          <span className="major-badge">
                            {item.jurusan_siswa}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              title="Edit siswa"
                              onClick={() => openEditModal(item)}
                            >
                              ✎
                            </button>

                            <button
                              className="delete-button"
                              title="Hapus siswa"
                              onClick={() => void handleDelete(item.kode_siswa)}
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>Made with love for every student <span>♡</span></span>
              <span>
                Total: <strong>{siswa.length} siswa</strong>
              </span>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 BloomSchool Administration</span>
            <span>Growing together, shining forever ✿</span>
          </footer>
        </section>
      </main>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <section
            className="student-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-top-decoration">
              <span>✿</span>
              <span>♡</span>
              <span>✧</span>
            </div>

            <div className="modal-heading">
              <div>
                <span className="section-kicker">STUDENT FORM</span>
                <h2>
                  {editingKode ? "Edit Student Data" : "Add New Student"}
                  <span> ♡</span>
                </h2>
                <p>
                  {editingKode
                    ? "Perbarui informasi siswa di bawah ini."
                    : "Yuk, lengkapi informasi siswa baru."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Kode Siswa
                <input
                  type="text"
                  placeholder="Contoh: S006"
                  value={form.kode_siswa}
                  onChange={(event) =>
                    setForm({ ...form, kode_siswa: event.target.value })
                  }
                  disabled={Boolean(editingKode)}
                  required
                  maxLength={20}
                />
              </label>

              <label>
                Nama Siswa
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={form.nama_siswa}
                  onChange={(event) =>
                    setForm({ ...form, nama_siswa: event.target.value })
                  }
                  required
                  maxLength={100}
                />
              </label>

              <label>
                Alamat Siswa
                <textarea
                  placeholder="Masukkan alamat lengkap"
                  value={form.alamat_siswa}
                  onChange={(event) =>
                    setForm({ ...form, alamat_siswa: event.target.value })
                  }
                  required
                  rows={3}
                />
              </label>

              <label>
                Tanggal Lahir
                <input
                  type="date"
                  value={form.tanggal_lahir}
                  onChange={(event) =>
                    setForm({ ...form, tanggal_lahir: event.target.value })
                  }
                  required
                />
              </label>

              <label>
                Jurusan Siswa
                <select
                  value={form.jurusan_siswa}
                  onChange={(event) =>
                    setForm({ ...form, jurusan_siswa: event.target.value })
                  }
                  required
                >
                  <option value="">Pilih jurusan</option>
                  <option value="Rekayasa Perangkat Lunak">
                    Rekayasa Perangkat Lunak
                  </option>
                  <option value="Teknik Komputer Jaringan">
                    Teknik Komputer Jaringan
                  </option>
                  <option value="Desain Komunikasi Visual">
                    Desain Komunikasi Visual
                  </option>
                  <option value="Akuntansi">Akuntansi</option>
                  <option value="Manajemen Perkantoran">
                    Manajemen Perkantoran
                  </option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Menyimpan..."
                    : editingKode
                      ? "Simpan Perubahan"
                      : "Simpan Data"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
