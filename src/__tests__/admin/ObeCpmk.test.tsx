import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ObeCpmk from '../../pages/admin-academic/academic/ObeCpmk';

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
  TableObeCpmk: ({ data, tableHead, error }: any) => (
    <div data-testid="table-obe-cpmk">
      <table>
        <thead>
          <tr>
            {tableHead.map((head: string, index: number) => (
              <th key={index}>{head}</th>
            ))}
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item: any) => (
              <tr key={item.id}>
                <td>{item.kodeMk}</td>
                <td>{item.mataKuliah}</td>
                <td>{item.statusCpmk}</td>
                <td>
                  <button 
                    data-testid={`detail-btn-${item.id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>{error}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ),
}));

vi.mock('../../types/VarRoutes', () => ({
  AdminAcademicRoute: {
    courseManagement: {
      courseManagement: '/admin/course-management',
    },
    obeManagement: {
      graduateProfile: '/admin/obe-management/graduate-profile',
      cpl: '/admin/obe-management/cpl',
      cpmk: '/admin/obe-management/cpmk',
    },
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ObeCpmk Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <TestWrapper>
        <ObeCpmk />
      </TestWrapper>
    );
  };

  describe('Component Rendering', () => {
    it('should render ObeCpmk component with correct title', () => {
      renderComponent();
      
      // Fix: Use getAllByText to handle multiple "CPMK" text occurrences
      const cpmkElements = screen.getAllByText('CPMK');
      expect(cpmkElements.length).toBeGreaterThan(0);
      expect(cpmkElements[0]).toBeInTheDocument();
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  describe('Dropdown Tahun Kurikulum', () => {
    it('should render year dropdown with default value 2024', () => {
      renderComponent();
      
      const yearDropdown = screen.getByDisplayValue('2024');
      expect(yearDropdown).toBeInTheDocument();
      expect(yearDropdown).toHaveValue('2024');
    });

    it('should render all year options in dropdown', () => {
      renderComponent();
      
      const yearDropdown = screen.getByDisplayValue('2024');
      
      // Check if all options are present
      const options = yearDropdown.querySelectorAll('option');
      expect(options).toHaveLength(3);
      
      expect(screen.getByRole('option', { name: '2024' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '2023' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '2022' })).toBeInTheDocument();
    });

    it('should update selectedYear when dropdown value is changed', () => {
      renderComponent();
      
      const yearDropdown = screen.getByDisplayValue('2024');
      
      // Change to 2023
      fireEvent.change(yearDropdown, { target: { value: '2023' } });
      expect(yearDropdown).toHaveValue('2023');
      
      // Change to 2022
      fireEvent.change(yearDropdown, { target: { value: '2022' } });
      expect(yearDropdown).toHaveValue('2022');
      
      // Change back to 2024
      fireEvent.change(yearDropdown, { target: { value: '2024' } });
      expect(yearDropdown).toHaveValue('2024');
    });

    it('should display selected year in the info section', () => {
      renderComponent();
      
      // Fix: Use getAllByText to handle multiple "2024" occurrences
      const yearElements = screen.getAllByText('2024');
      expect(yearElements.length).toBeGreaterThan(0);
      
      // Change dropdown to 2023
      const yearDropdown = screen.getByDisplayValue('2024');
      fireEvent.change(yearDropdown, { target: { value: '2023' } });
      
      // Should display 2023 in info section
      const infoYearElements = screen.getAllByText('2023');
      expect(infoYearElements.length).toBeGreaterThan(0);
    });

    it('should have correct styling classes for dropdown', () => {
      renderComponent();
      
      const yearDropdown = screen.getByDisplayValue('2024');
      expect(yearDropdown).toHaveClass('border', 'border-black/50', 'rounded-md', 'px-2', 'py-1', 'w-40');
    });

    it('should render "Tahun Kurikulum" label next to dropdown', () => {
      renderComponent();
      
      expect(screen.getByText('Tahun Kurikulum')).toBeInTheDocument();
      
      // Check if label has correct styling
      const label = screen.getByText('Tahun Kurikulum');
      expect(label).toHaveClass('text-lg', 'font-semibold');
    });
  });

  describe('Button Aksi Detail', () => {
    it('should render detail buttons for each CPMK data row', () => {
      renderComponent();
      
      const detailButton1 = screen.getByTestId('detail-btn-1');
      const detailButton2 = screen.getByTestId('detail-btn-2');
      
      expect(detailButton1).toBeInTheDocument();
      expect(detailButton2).toBeInTheDocument();
    });

    it('should render detail buttons with correct text', () => {
      renderComponent();
      
      const detailButtons = screen.getAllByText('Detail');
      expect(detailButtons).toHaveLength(2);
      
      detailButtons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should have correct styling for detail buttons', () => {
      renderComponent();
      
      const detailButton1 = screen.getByTestId('detail-btn-1');
      const detailButton2 = screen.getByTestId('detail-btn-2');
      
      expect(detailButton1).toHaveClass('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded');
      expect(detailButton2).toHaveClass('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded');
    });

    it('should be clickable detail buttons', () => {
      renderComponent();
      
      const detailButton1 = screen.getByTestId('detail-btn-1');
      const detailButton2 = screen.getByTestId('detail-btn-2');
      
      // Test if buttons are clickable
      fireEvent.click(detailButton1);
      fireEvent.click(detailButton2);
      
      // Buttons should remain in document after clicking
      expect(detailButton1).toBeInTheDocument();
      expect(detailButton2).toBeInTheDocument();
    });

    it('should render detail buttons for correct data rows', () => {
      renderComponent();
      
      // Check if detail button is associated with correct data
      const detailButton1 = screen.getByTestId('detail-btn-1');
      const detailButton2 = screen.getByTestId('detail-btn-2');
      
      // Get the row containing PL001
      const pl001Row = detailButton1.closest('tr');
      expect(pl001Row).toContainElement(screen.getByText('PL001'));
      expect(pl001Row).toContainElement(screen.getByText('Pemrograman Dasar'));
      
      // Get the row containing PL002
      const pl002Row = detailButton2.closest('tr');
      expect(pl002Row).toContainElement(screen.getByText('PL002'));
      
      // Fix: Use a more specific selector for "Pemrograman Lanjut" in table
      // Since "Pemrograman Lanjut" appears in both info section and table,
      // we need to be more specific about which one we're testing
      const tableCells = screen.getAllByText('Pemrograman Lanjut');
      const tableCell = tableCells.find(cell => cell.tagName === 'TD');
      expect(tableCell).toBeDefined();
      expect(pl002Row).toContainElement(tableCell!);
    });
  });
});
