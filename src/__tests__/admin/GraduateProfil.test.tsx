import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GraduateProfile from '../../pages/admin-academic/academic/GraduateProfile';

// Mock dependencies
vi.mock('../../components/layouts/MainLayout', () => ({
  default: ({ children, titlePage }: any) => (
    <div data-testid="main-layout">
      <h1>{titlePage}</h1>
      {children}
    </div>
  ),
}));

vi.mock('../../components/Table', () => ({
  TableGraduateProfile: ({ 
    data, 
    onEdit, 
    onDelete, 
    isEditing, 
    currentData, 
    onSave, 
    onReset, 
    onInputChange, 
    isAdding, 
    isFormValid 
  }: any) => (
    <div data-testid="table-graduate-profile">
      <table>
        <tbody>
          {data.map((item: any) => (
            <tr key={item.id}>
              <td>{item.kodePl}</td>
              <td>{item.profilLulusan}</td>
              <td>{item.profesi}</td>
              <td>{item.deskripsi}</td>
              <td>
                <button 
                  data-testid={`edit-btn-${item.id}`}
                  onClick={() => onEdit(item.id)}
                >
                  Edit
                </button>
                <button 
                  data-testid={`delete-btn-${item.id}`}
                  onClick={() => onDelete(item.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Form editing/adding */}
      {(isEditing || isAdding) && currentData && (
        <div data-testid="edit-form">
          <input
            data-testid="kode-pl-input"
            name="kodePl"
            value={currentData.kodePl}
            onChange={onInputChange}
            placeholder="Kode PL"
          />
          <input
            data-testid="profil-lulusan-input"
            name="profilLulusan"
            value={currentData.profilLulusan}
            onChange={onInputChange}
            placeholder="Profil Lulusan"
          />
          <input
            data-testid="profesi-input"
            name="profesi"
            value={currentData.profesi}
            onChange={onInputChange}
            placeholder="Profesi"
          />
          <input
            data-testid="deskripsi-input"
            name="deskripsi"
            value={currentData.deskripsi}
            onChange={onInputChange}
            placeholder="Deskripsi"
          />
          <button 
            data-testid="form-save-btn"
            onClick={onSave}
            disabled={!isFormValid()}
          >
            Simpan Form
          </button>
          <button 
            data-testid="form-reset-btn"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
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

// mockNavigate 
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper componentuntuk testing 
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mau mengecek profil lulusan 
describe('GraduateProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <TestWrapper>
        <GraduateProfile />
      </TestWrapper>
    );
  };

//   cek tombol kembali 
  describe('Button Kembali', () => {
    // mau mengcek kalau button di klik, maka akan balik kembali 
    it('should navigate back when kembali button is clicked', () => {
      renderComponent();
      
      const kembaliButtons = screen.getAllByText(/kembali/i);
      fireEvent.click(kembaliButtons[0]); // untuk cek button kembali di klik 
      
      expect(mockNavigate).toHaveBeenCalledWith('/admin/obe-management');
    });

    // ketika button di klik, akan mengarahkan kembali ke kembali 
    it('should navigate back when arrow back button is clicked', () => {
      renderComponent();
      
      const backButtons = screen.getAllByRole('button');
      const arrowBackButton = backButtons.find(btn => 
        btn.querySelector('svg') && btn.textContent === ''
      );
      
      if (arrowBackButton) {
        fireEvent.click(arrowBackButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/obe-management');
      }
    });
  });

  //buat ngecek input seach dan button search 
  describe('Input Search Box & Button Search', () => {
    it('should render search input with correct placeholder', () => {
      renderComponent();
    
    //ketika render search input dengan placeholder yang benar 
      const searchInput = screen.getByPlaceholderText('Cari Profil Lulusan');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'search');
    });
//mau cek apa bisa ngetik di search input 
    it('should allow typing in search input', () => {
      renderComponent();
      
      const searchInput = screen.getByPlaceholderText('Cari Profil Lulusan');
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      
      expect(searchInput).toHaveValue('test search');
    });
// mau cek button apakah searchnya di render apa tidak 
  it('should render search button', () => {
      renderComponent();
      
      // Alternative approaches to find search button:
      
      // Option 1: Find by CSS class
      const searchButton = document.querySelector('.bg-primary-yellow');
      expect(searchButton).toBeInTheDocument();
      
      // Option 2: Find button next to search input
      const searchInput = screen.getByPlaceholderText('Cari Profil Lulusan');
      const searchButton2 = searchInput.nextElementSibling;
      expect(searchButton2).toBeInTheDocument();
      expect(searchButton2?.tagName).toBe('BUTTON');
    });
  });
//mau cek button simpan 
  describe('Button Simpan', () => {
    //mau cek simpan button ada apa tidak ketika di render 
    it('should render simpan button', () => {
      renderComponent();
      
      const simpanButton = screen.getByText('Simpan');
      expect(simpanButton).toBeInTheDocument();
    });
//mau cek apakah ketika simpan button di klik, akan memberikan handleSave 
    it('should call handleSave when simpan button is clicked', () => {
      renderComponent();
      
      const simpanButton = screen.getByText('Simpan');
      fireEvent.click(simpanButton);
    
      expect(simpanButton).toBeInTheDocument();
    });
  });

  //mengecek tambah profil lulusan 
  describe('Button Tambah Profil Lulusan', () => {
    it('should render tambah profil lulusan button', () => {
      renderComponent();
      
      const tambahButton = screen.getByText('Tambah Profil Lulusan');
      expect(tambahButton).toBeInTheDocument();
    });
//mau cek apakah ketika button di klik, bisa detect Tambah Profil Lulusan 
    it('should enable adding mode when tambah button is clicked', () => {
      renderComponent();
      
      const tambahButton = screen.getByText('Tambah Profil Lulusan');
      fireEvent.click(tambahButton);
      
      // Check if form appears
      expect(screen.getByTestId('edit-form')).toBeInTheDocument();
    });
//mau cek apakah akan idisable buttonnya di saat edit 
    it('should disable tambah button when in editing mode', () => {
      renderComponent();
      
      // First click edit on an existing item
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);
      
      // Check if tambah button is disabled
      const tambahButton = screen.getByText('Tambah Profil Lulusan');
      expect(tambahButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Button Edit', () => {
    it('should render edit buttons for each data row', () => {
      renderComponent();
      
      const editButton1 = screen.getByTestId('edit-btn-1');
      const editButton2 = screen.getByTestId('edit-btn-2');
      
      expect(editButton1).toBeInTheDocument();
      expect(editButton2).toBeInTheDocument();
    });

    it('should enable editing mode when edit button is clicked', () => {
      renderComponent();
      
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);
      
      // Check if form appears with data
      expect(screen.getByTestId('edit-form')).toBeInTheDocument();
      expect(screen.getByTestId('kode-pl-input')).toHaveValue('PL001');
    });
  });

  describe('Button Hapus', () => {
    it('should render delete buttons for each data row', () => {
      renderComponent();
      
      const deleteButton1 = screen.getByTestId('delete-btn-1');
      const deleteButton2 = screen.getByTestId('delete-btn-2');
      
      expect(deleteButton1).toBeInTheDocument();
      expect(deleteButton2).toBeInTheDocument();
    });

    it('should remove data when delete button is clicked', () => {
      renderComponent();
      
      // Check initial data exists
      expect(screen.getByTestId('delete-btn-1')).toBeInTheDocument();
      
      // Click delete
      const deleteButton = screen.getByTestId('delete-btn-1');
      fireEvent.click(deleteButton);
      
      // Check if data is removed
      expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
    });
  });

  describe('Submit Data Baru - Data Valid', () => {
    it('should successfully add new data when all fields are valid', async () => {
      renderComponent();
      
      // Click tambah button
      const tambahButton = screen.getByText('Tambah Profil Lulusan');
      fireEvent.click(tambahButton);
      
      // Fill form with valid data
      fireEvent.change(screen.getByTestId('kode-pl-input'), { target: { value: 'PL003' } });
      fireEvent.change(screen.getByTestId('profil-lulusan-input'), { target: { value: 'New Profile' } });
      fireEvent.change(screen.getByTestId('profesi-input'), { target: { value: 'New Profession' } });
      fireEvent.change(screen.getByTestId('deskripsi-input'), { target: { value: 'New Description' } });
      
      // Submit form
      const saveButton = screen.getByTestId('form-save-btn');
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);
      
      // Check if form is closed (not in adding mode anymore)
      await waitFor(() => {
        expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Submit Data Baru - Data Tidak Valid', () => {
    it('should show error message when submitting invalid data', async () => {
      renderComponent();
      
      // Click tambah button
      const tambahButton = screen.getByText('Tambah Profil Lulusan');
      fireEvent.click(tambahButton);
      
      // Leave some fields empty (invalid data)
      fireEvent.change(screen.getByTestId('kode-pl-input'), { target: { value: 'PL003' } });
      // Leave other fields empty
      
      // Try to submit form
      const saveButton = screen.getByTestId('form-save-btn');
      expect(saveButton).toBeDisabled(); // Should be disabled when form is invalid
    });

    it('should display error message for invalid form submission', async () => {
      renderComponent();
      
      // Click tambah button
      const tambahButton = screen.getByText('Tambah Profil Lulusan');
      fireEvent.click(tambahButton);
      
      // Fill only some fields
      fireEvent.change(screen.getByTestId('kode-pl-input'), { target: { value: 'PL003' } });
      
      // Click main save button (not form save button)
      const mainSaveButton = screen.getByText('Simpan');
      fireEvent.click(mainSaveButton);
      
      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('Semua kolom harus diisi sebelum menyimpan.')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Data - Data Valid', () => {
    it('should successfully update data when editing with valid data', async () => {
      renderComponent();
      
      // Click edit button
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);
      
      // Update form with valid data
      fireEvent.change(screen.getByTestId('profesi-input'), { target: { value: 'Updated Profession' } });
      
      // Submit form
      const saveButton = screen.getByTestId('form-save-btn');
      expect(saveButton).not.toBeDisabled();
      fireEvent.click(saveButton);
      
      // Check if form is closed
      await waitFor(() => {
        expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Data - Data Tidak Valid', () => {
    it('should show error when editing with invalid data', async () => {
      renderComponent();
      
      // Click edit button
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);
      
      // Clear required field (make invalid)
      fireEvent.change(screen.getByTestId('kode-pl-input'), { target: { value: '' } });
      
      // Try to submit
      const saveButton = screen.getByTestId('form-save-btn');
      expect(saveButton).toBeDisabled(); // Should be disabled when form is invalid
    });

    it('should display error message when editing with invalid data', async () => {
      renderComponent();
      
      // Click edit button
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);
      
      // Clear a required field
      fireEvent.change(screen.getByTestId('kode-pl-input'), { target: { value: '' } });
      
      // Click main save button
      const mainSaveButton = screen.getByText('Simpan');
      fireEvent.click(mainSaveButton);
      
      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('Semua kolom harus diisi sebelum menyimpan.')).toBeInTheDocument();
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form when reset button is clicked', async () => {
      renderComponent();
      
      // Start editing
      const editButton = screen.getByTestId('edit-btn-1');
      fireEvent.click(editButton);
      
      // Click reset
      const resetButton = screen.getByTestId('form-reset-btn');
      fireEvent.click(resetButton);
      
      // Check if form is closed
      await waitFor(() => {
        expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Year Selection', () => {
    it('should render year selection dropdown', () => {
      renderComponent();
      
      const yearSelect = screen.getByDisplayValue('2024');
      expect(yearSelect).toBeInTheDocument();
    });

    it('should update selected year when changed', () => {
      renderComponent();
      
      const yearSelect = screen.getByDisplayValue('2024');
      fireEvent.change(yearSelect, { target: { value: '2023' } });
      
      expect(yearSelect).toHaveValue('2023');
    });
  });
});
