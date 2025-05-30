import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import ObeCpl from '../../pages/admin-academic/academic/ObeCpl';
import { AdminAcademicRoute } from '../../types/VarRoutes';

const mockNavigate = vi.fn();

// Mock useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock MainLayout
vi.mock('../../components/layouts/MainLayout', () => ({
  default: ({ children, titlePage }: { children: React.ReactNode; titlePage: string }) => (
    <div data-testid="main-layout">
      <h1>{titlePage}</h1>
      {children}
    </div>
  ),
}));

// Mock TableObeCPL yang lebih interaktif
// Update mock TableObeCPL di file test Anda:
vi.mock('../../components/Table', () => ({
  TableObeCPL: vi.fn(
    ({
      data,
      onEdit,
      onDelete,
      isEditing,
      isAdding,
      currentData,
      onSave,
      onReset,
      onInputChange,
      isFormValid,
    }: any) => (
      <div data-testid="table-obe-cpl">
        {data.map((item: any) => (
          <div key={item.id} data-testid={`row-${item.id}`}>
            <span data-testid={`kode-${item.id}`}>{item.kodePl}</span>
            <span data-testid={`deskripsi-${item.id}`}>{item.deskripsiCapaianPembelajaran}</span>
            <span data-testid={`kategori-${item.id}`}>{item.kategori}</span>
            <span data-testid={`pemetaan-${item.id}`}>{item.pemetaan}</span>
            <button data-testid={`edit-btn-${item.id}`} onClick={() => onEdit(item.id)}>Edit</button>
            <button data-testid={`delete-btn-${item.id}`} onClick={() => onDelete(item.id)}>Hapus</button>
          </div>
        ))}
        {(isEditing || isAdding) && currentData && (
          <div data-testid="cpl-form">
            <input
              type="text"
              aria-label="Kode PL Form"
              data-testid="input-kodePl"
              name="kodePl"
              value={currentData.kodePl || ''}
              onChange={onInputChange}
            />
            <input
              type="text"
              aria-label="Deskripsi Capaian Pembelajaran Form"
              data-testid="input-deskripsiCapaianPembelajaran"
              name="deskripsiCapaianPembelajaran"
              value={currentData.deskripsiCapaianPembelajaran || ''}
              onChange={onInputChange}
            />
            <input
              type="text"
              aria-label="Kategori Form"
              data-testid="input-kategori"
              name="kategori"
              value={currentData.kategori || ''}
              onChange={onInputChange}
            />
            <input
              type="text"
              aria-label="Pemetaan PL ke CPL Form"
              data-testid="input-pemetaan"
              name="pemetaan"
              value={currentData.pemetaan || ''}
              onChange={onInputChange}
            />
            {/* PENTING: Hapus disabled agar handleSave bisa dipanggil untuk test error */}
            <button 
              data-testid="save-form-btn" 
              onClick={onSave}
            >
              Simpan Form
            </button>
            <button data-testid="reset-form-btn" onClick={onReset}>
              Batal Form
            </button>
          </div>
        )}
      </div>
    ),
  ),
}));

vi.mock('../../types/VarRoutes', () => ({
  AdminAcademicRoute: {
    obeManagement: {
      obeManagement: '/admin/obe-management',
      graduateProfile: '/admin/obe-management/graduate-profile',
      cpl: '/admin/obe-management/cpl',
      cpmk: '/admin/obe-management/cpmk',
    },
  },
}));

// Helper untuk merender dengan MemoryRouter karena ada penggunaan useNavigate
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('ObeCpl Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Bersihkan semua mock sebelum setiap tes
  });

  const renderComponent = () => {
    return renderWithRouter(<ObeCpl />);
  };

  // ============= EXISTING TESTS =============
  describe('Component Rendering Tests', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('should render the main title "Data Mata Kuliah"', () => {
      expect(screen.getByRole('heading', { name: /Data Mata Kuliah/i })).toBeInTheDocument();
    });

    // button tambah cpl 
    it('should render "Tambah CPL" button', () => {
      expect(screen.getByRole('button', { name: /Tambah CPL/i })).toBeInTheDocument();
    });

    // Buat cek apakah dropdown kurikulum ada 
    it('should render "Tahun Kurikulum" dropdown next to "Tambah CPL" button', () => {
      // Menggunakan label visual karena tidak ada htmlFor/id
      const tahunKurikulumLabel = screen.getByText('Tahun Kurikulum');
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const dropdown = tahunKurikulumLabel.parentElement?.querySelector('select');
      expect(dropdown).toBeInTheDocument();
      if (dropdown) {
        expect(within(dropdown).getByRole('option', { name: '2024' })).toBeInTheDocument();
        expect(within(dropdown).getByRole('option', { name: '2023' })).toBeInTheDocument();
        expect(within(dropdown).getByRole('option', { name: '2022' })).toBeInTheDocument();
      }
    });

    // Cek apakah tombol Edit dan Hapus dirender untuk data awal
    // (berdasarkan bagaimana mock TableObeCPL dirender)
    it('should render action buttons (Edit & Hapus) via mocked table', () => {
      expect(screen.getByTestId('edit-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-btn-2')).toBeInTheDocument();
      expect(screen.getByTestId('delete-btn-2')).toBeInTheDocument();
    });
  });

  // ============= NEW INTEGRATION TESTS =============
  describe('Submit Data Baru - Data Valid', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('should successfully add new CPL data with valid inputs', async () => {
      // Klik tombol "Tambah CPL"
      const addButton = screen.getByRole('button', { name: /tambah cpl/i });
      fireEvent.click(addButton);

      // Pastikan form muncul
      expect(screen.getByTestId('cpl-form')).toBeInTheDocument();

      // Isi form dengan data valid
      const kodePlInput = screen.getByTestId('input-kodePl');
      const deskripsiInput = screen.getByTestId('input-deskripsiCapaianPembelajaran');
      const kategoriInput = screen.getByTestId('input-kategori');
      const pemetaanInput = screen.getByTestId('input-pemetaan');

      fireEvent.change(kodePlInput, { target: { value: 'PL003' } });
      fireEvent.change(deskripsiInput, { target: { value: 'Pemrograman Web' } });
      fireEvent.change(kategoriInput, { target: { value: 'Frontend' } });
      fireEvent.change(pemetaanInput, { target: { value: 'PPL003' } });

      // Klik tombol Save
      const saveButton = screen.getByTestId('save-form-btn');
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);

      // Verifikasi data baru ditambahkan ke tabel
      await waitFor(() => {
        // Cari row dengan id yang baru (menggunakan timestamp, jadi akan lebih besar dari 2)
        const newRows = screen.getAllByTestId(/^row-\d+$/);
        expect(newRows.length).toBeGreaterThan(2); // Awalnya ada 2 data

        // Verifikasi data baru ada di salah satu row
        const allKodeElements = screen.getAllByTestId(/^kode-\d+$/);
        const hasNewData = allKodeElements.some(el => el.textContent === 'PL003');
        expect(hasNewData).toBeTruthy();
      });

      // Verifikasi form hilang setelah save
      expect(screen.queryByTestId('cpl-form')).not.toBeInTheDocument();
    });

    it('should clear form and hide it after successful save', async () => {
      const addButton = screen.getByRole('button', { name: /tambah cpl/i });
      fireEvent.click(addButton);

      // Isi form lengkap
      fireEvent.change(screen.getByTestId('input-kodePl'), { target: { value: 'PL004' } });
      fireEvent.change(screen.getByTestId('input-deskripsiCapaianPembelajaran'), { target: { value: 'Mobile Development' } });
      fireEvent.change(screen.getByTestId('input-kategori'), { target: { value: 'Mobile' } });
      fireEvent.change(screen.getByTestId('input-pemetaan'), { target: { value: 'PPL004' } });

      const saveButton = screen.getByTestId('save-form-btn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByTestId('cpl-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Submit Data Baru - Data Tidak Valid', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('should show error message when trying to add CPL with invalid/empty data', async () => {
      // Klik tombol "Tambah CPL"
      const addButton = screen.getByRole('button', { name: /tambah cpl/i });
      fireEvent.click(addButton);

      // Pastikan form muncul
      expect(screen.getByTestId('cpl-form')).toBeInTheDocument();

      // Isi form dengan data tidak lengkap (hanya beberapa field)
      const kodePlInput = screen.getByTestId('input-kodePl');
      fireEvent.change(kodePlInput, { target: { value: 'PL003' } });
      // Biarkan field lain kosong

      // Klik tombol Save
      const saveButton = screen.getByTestId('save-form-btn');
      fireEvent.click(saveButton);

      // Verifikasi error message muncul
      await waitFor(() => {
        expect(screen.getByText('Semua kolom harus diisi sebelum menyimpan.')).toBeInTheDocument();
      });

      // Verifikasi data tidak ditambahkan (masih 2 data awal)
      const allRows = screen.getAllByTestId(/^row-\d+$/);
      expect(allRows).toHaveLength(2);
    });

    it('should keep form visible when save fails due to validation', async () => {
      const addButton = screen.getByRole('button', { name: /tambah cpl/i });
      fireEvent.click(addButton);

      // Isi data tidak lengkap
      fireEvent.change(screen.getByTestId('input-kodePl'), { target: { value: 'PL003' } });

      const saveButton = screen.getByTestId('save-form-btn');
      fireEvent.click(saveButton);

      // Form masih terlihat karena validasi gagal
      await waitFor(() => {
        expect(screen.getByTestId('cpl-form')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Data - Data Valid', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('should successfully edit existing CPL data with valid inputs', async () => {
      // Klik tombol edit untuk data pertama (id: 1)
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);

      // Pastikan form edit muncul dengan data existing
      expect(screen.getByTestId('cpl-form')).toBeInTheDocument();
      
      const kodePlInput = screen.getByTestId('input-kodePl');
      expect(kodePlInput).toHaveValue('PL001');

      // Edit data dengan nilai baru yang valid
      const deskripsiInput = screen.getByTestId('input-deskripsiCapaianPembelajaran');
      fireEvent.change(deskripsiInput, { target: { value: 'Pemrograman Dasar - Updated' } });

      const kategoriInput = screen.getByTestId('input-kategori');
      fireEvent.change(kategoriInput, { target: { value: 'Algoritma - Updated' } });

      // Klik tombol Save
      const saveButton = screen.getByTestId('save-form-btn');
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);

      // Verifikasi data ter-update di tabel
      await waitFor(() => {
        const deskripsiElement = screen.getByTestId('deskripsi-1');
        const kategoriElement = screen.getByTestId('kategori-1');
        expect(deskripsiElement.textContent).toBe('Pemrograman Dasar - Updated');
        expect(kategoriElement.textContent).toBe('Algoritma - Updated');
      });

      // Verifikasi form hilang setelah save
      expect(screen.queryByTestId('cpl-form')).not.toBeInTheDocument();
    });

    it('should populate form with existing data when editing', async () => {
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);

      // Verifikasi form terisi dengan data existing
      expect(screen.getByTestId('input-kodePl')).toHaveValue('PL001');
      expect(screen.getByTestId('input-deskripsiCapaianPembelajaran')).toHaveValue('Pemrograman Dasar');
      expect(screen.getByTestId('input-kategori')).toHaveValue('Algoritma');
      expect(screen.getByTestId('input-pemetaan')).toHaveValue('PPL001');
    });
  });

  describe('Edit Data - Data Tidak Valid', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('should show error message when trying to edit CPL with invalid data', async () => {
      // Klik tombol edit untuk data pertama
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);

      // Pastikan form edit muncul
      expect(screen.getByTestId('cpl-form')).toBeInTheDocument();

      // Hapus salah satu field yang required
      const deskripsiInput = screen.getByTestId('input-deskripsiCapaianPembelajaran');
      fireEvent.change(deskripsiInput, { target: { value: '' } });

      // Klik tombol Save
      const saveButton = screen.getByTestId('save-form-btn');
      fireEvent.click(saveButton);

      // Verifikasi error message muncul
      await waitFor(() => {
        expect(screen.getByText('Semua kolom harus diisi sebelum menyimpan.')).toBeInTheDocument();
      });

      // Verifikasi data tidak ter-update (masih data original)
      const deskripsiElement = screen.getByTestId('deskripsi-1');
      expect(deskripsiElement.textContent).toBe('Pemrograman Dasar');
    });

    it('should maintain original data when edit fails validation', async () => {
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);

      // Kosongkan field dan coba save
      fireEvent.change(screen.getByTestId('input-deskripsiCapaianPembelajaran'), { target: { value: '' } });
      fireEvent.change(screen.getByTestId('input-kategori'), { target: { value: '' } });

      const saveButton = screen.getByTestId('save-form-btn');
      fireEvent.click(saveButton);

      // Reset form untuk keluar dari mode edit
      const resetButton = screen.getByTestId('reset-form-btn');
      fireEvent.click(resetButton);

      // Verifikasi data original masih ada
      await waitFor(() => {
        expect(screen.getByTestId('deskripsi-1').textContent).toBe('Pemrograman Dasar');
        expect(screen.getByTestId('kategori-1').textContent).toBe('Algoritma');
      });
    });
  });
  });
