import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CurriculumProdi from "../../pages/admin-academic/academic/CurriculumProdi"; // Sesuaikan path jika perlu

// Mock MainLayout karena kita hanya fokus pada unit test CurriculumProdi
vi.mock("../../components/layouts/MainLayout", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, titlePage }: any) => (
    <div>
      <h1>{titlePage}</h1>
      {children}
    </div>
  ),
}));

// Mock TableCurriculumProdi
vi.mock("../../components/Table", () => ({
  TableCurriculumProdi: () => <div data-testid="table-curriculum-prodi">Mocked Table</div>,
}));

describe("CurriculumProdi Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <CurriculumProdi />
      </MemoryRouter>
    );
  });

  it("should render the main title", () => {
    expect(screen.getByRole("heading", { name: /Kurikulum Prodi/i })).toBeInTheDocument();
  });

  // --- Bagian Filter Program Studi dan Kurikulum ---
  it("should render dropdown Program Studi", () => {
    expect(screen.getByText(/Program Studi/i)).toBeInTheDocument();
    const dropdowns = screen.getAllByRole("combobox");
    // Asumsi dropdown Program Studi adalah yang pertama dengan opsi default tertentu
    expect(dropdowns.find(select => select.textContent?.includes("-- Semua Status --"))).toBeInTheDocument();
  });

  it("should render dropdown Kurikulum", () => {
  // Jika Anda hanya ingin memastikan ada SPAN dengan teks "Kurikulum" (label visualnya)
  const kurikulumLabelSpan = screen.getByText((content, element) => {
    return element?.tagName.toLowerCase() === 'span' &&
           element.textContent?.trim() === 'Kurikulum' &&
           element.classList.contains('text-primary-yellow'); // Sesuaikan class jika perlu
  });
  expect(kurikulumLabelSpan).toBeInTheDocument();

  // Langkah selanjutnya untuk memastikan dropdown <select> itu sendiri ada
  // (dengan asumsi accessible name sudah diperbaiki di komponen Anda):
  const kurikulumCombobox = screen.getByRole('combobox', { name: /Kurikulum/i });
  expect(kurikulumCombobox).toBeInTheDocument();
});

  it("should render Salin button", () => {
    expect(screen.getByRole("button", { name: /Salin/i })).toBeInTheDocument();
  });

  it("should render Cetak button", () => {
    expect(screen.getByRole("button", { name: /Cetak/i })).toBeInTheDocument();
  });

  // --- Bagian Filter Mata Kuliah, Semester, Nilai ---
  it("should render dropdown Mata Kuliah", () => {
    // Menggunakan getByText karena label "Mata Kuliah" adalah span, bukan label formal untuk select
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.startsWith('Mata Kuliah');
    })).toBeInTheDocument();
    // Mencari select berdasarkan opsi defaultnya
    expect(screen.getByRole("combobox", { name: /Mata Kuliah/i })).toBeInTheDocument();
  });

  it("should render dropdown Semester", () => {
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.startsWith('Semester');
    })).toBeInTheDocument();
    // Mencari select berdasarkan opsi defaultnya, perlu penyesuaian jika nilai default bukan nama
    const semesterDropdown = screen.getAllByRole("combobox").find(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        select => select.querySelector('option[value="all"]')?.textContent?.includes("-- 2024 --")
    );
    expect(semesterDropdown).toBeInTheDocument();
  });

  it("should render dropdown Nilai", () => {
     expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.startsWith('Nilai');
    })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Nilai/i })).toBeInTheDocument();
  });

  // --- Bagian Opsi Tambahan ---
  it("should render 'Opsi Tambahan' checkboxes", () => {
    expect(screen.getByRole("heading", { name: /Opsi Tambahan/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/MK Wajib/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paket MK/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MK Wajib/i)).toHaveAttribute("type", "checkbox");
    expect(screen.getByLabelText(/Paket MK/i)).toHaveAttribute("type", "checkbox");
  });

  it("should render Tambah button", () => {
    expect(screen.getByRole("button", { name: /Tambah/i })).toBeInTheDocument();
  });

  // --- Bagian Tabel ---
  it("should render TableCurriculumProdi components", () => {
    // Karena kita mock TableCurriculumProdi, kita cek berdasarkan data-testid atau jumlahnya
    const tables = screen.getAllByTestId("table-curriculum-prodi");
    expect(tables.length).toBeGreaterThanOrEqual(2); // Anda merender 2 tabel
  });
});
