import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OBEManagement from "../../pages//admin-academic/academic/OBEManagement"; 
import { MemoryRouter } from "react-router-dom";

// Mock MainLayout
vi.mock("../../components/layouts/MainLayout", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, titlePage }: any) => (
    <div>
      <h1>{titlePage}</h1>
      {children}
    </div>
  ),
}));

// Mock TableOBE
vi.mock("../../components/Table", () => ({
  TableOBE: () => <div data-testid="table-obe">Mocked OBE Table</div>,
}));

describe("OBEManagement Component", () => {
  beforeEach(() => {
     render(
      <MemoryRouter>
        <OBEManagement />
      </MemoryRouter>
    );
  });

  it("should render the main title", () => {
    expect(screen.getByRole("heading", { name: /Manajemen OBE/i })).toBeInTheDocument();
  });

   it("should render dropdown Tahun Kurikulum", () => {
    expect(screen.getByText(/Tahun Kurikulum/i)).toBeInTheDocument();
    const dropdowns = screen.getAllByRole("combobox");
    // Asumsi dropdown Tahun kurikulum adalah yang pertama dengan opsi default tertentu
    expect(dropdowns.find(select => select.textContent?.includes("2025"))).toBeInTheDocument();
  });

it("should render dropdown Program Studi and its default option", () => {
  const programStudiDropdown = screen.getByTestId("programStudi-select");
  expect(programStudiDropdown).toBeInTheDocument();
  expect(programStudiDropdown).toHaveRole("combobox");

  const { getByRole: getByRoleInDropdown } = within(programStudiDropdown);
  expect(getByRoleInDropdown("option", { name: "-- Semua Program Studi --" })).toBeInTheDocument();
});

it("should render dropdown Jenjang and its default option", () => {
  const jenjangDropdown = screen.getByTestId("jenjang-select");
  expect(jenjangDropdown).toBeInTheDocument();
  expect(jenjangDropdown).toHaveRole("combobox");

  const { getByRole: getByRoleInDropdown } = within(jenjangDropdown);
  expect(getByRoleInDropdown("option", { name: "-- Semua Jenjang --" })).toBeInTheDocument();
});

  // --- Bagian Search ---
  it("should render input search box", () => {
    expect(screen.getByPlaceholderText(/Cari Program Studi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Cari Program Studi/i)).toHaveAttribute("type", "search");
  });

  it("should render search button", () => {
    const searchButton = screen.getByRole("button", { name: "" }); // 
  
    const searchInput = screen.getByPlaceholderText(/Cari Program Studi/i);
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const searchButtonSpecific = searchInput.parentElement?.querySelector('button');
    expect(searchButtonSpecific).toBeInTheDocument();
    //  juga bisa menambahkan data-testid="search-button" pada button di komponen
  
  });


  // --- Bagian Pagination ---
  it("should render dropdown pagination (items per page)", () => {
    const paginationDropdown = screen.getByRole("combobox", {
      // Mencari berdasarkan opsi yang ada di dalamnya karena tidak ada label eksplisit
      // Ini bisa rapuh jika teks opsi berubah. Pertimbangkan aria-label pada select ini.
      name: (accessibleName, element) => {
        const options = Array.from(element.querySelectorAll("option"));
        return options.some(opt => opt.textContent === "10 Baris");
      }
    });
    expect(paginationDropdown).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10 Baris" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "25 Baris" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50 Baris" })).toBeInTheDocument();
  });
});

