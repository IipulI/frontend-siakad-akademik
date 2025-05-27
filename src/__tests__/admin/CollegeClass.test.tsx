import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import CollegeClass from "../../pages/admin-academic/class/CollegeClass";

// Helper render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CollegeClass Component", () => {
  beforeEach(() => {
    renderWithRouter(<CollegeClass />);
  });

  it("should render Home button (Tambah)", () => {
    expect(screen.getByRole("button", { name: /tambah/i })).toBeInTheDocument();
  });

  it("should render the table of kelas kuliah", () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  
  it("should render all dropdowns", () => {
    expect(screen.getByText(/Periode Akademik/i)).toBeInTheDocument();
    expect(screen.getByText(/Tahun Kurikulum/i)).toBeInTheDocument();
    const prodiElements = screen.getAllByText(/Prodi Pengampu/i);
    expect(prodiElements.length).toBeGreaterThan(0);
    const sistemKuliah = screen.getAllByText(/Sistem Kuliah/i);
    expect(sistemKuliah.length).toBeGreaterThan(0);
  });

  it("should allow typing in search input and clicking search", () => {
    const searchInput = screen.getByPlaceholderText(/Cari Kelas Kuliah/i);
    fireEvent.change(searchInput, { target: { value: "Algoritma" } });
    expect((searchInput as HTMLInputElement).value).toBe("Algoritma");

    const buttons = screen.getAllByRole("button");
    const searchButton = buttons.find((btn) =>
      (btn.querySelector("svg") as Element)?.classList.contains("lucide-search")
    );
    if (searchButton) fireEvent.click(searchButton);
  });

  it("should trigger refresh button click", () => {
    const buttons = screen.getAllByRole("button");
    const refreshButton = buttons.find((btn) =>
      (btn.querySelector("svg") as Element)?.classList.contains("lucide-refresh-cw")
    );
    if (refreshButton) fireEvent.click(refreshButton);
  });

  it("should trigger click on Tambah button", () => {
    const tambahButton = screen.getByRole("button", { name: /tambah/i });
    fireEvent.click(tambahButton);
    // Tambah expect di sini jika muncul modal/form
  });

  it("should render pagination", async () => {
    expect(await screen.findByText(/Kelas Kuliah/i)).toBeInTheDocument();
  });

  it("should render action buttons (view and delete) per row", async () => {
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");

    const viewButtons = buttons.filter((btn) =>
      btn.querySelector("svg[class*='lucide-eye']")
    );
    const deleteButtons = buttons.filter((btn) =>
      btn.querySelector("svg[class*='lucide-trash-2']")
    );

    // Pastikan tombol-tombol ini ada
    expect(viewButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });
});
