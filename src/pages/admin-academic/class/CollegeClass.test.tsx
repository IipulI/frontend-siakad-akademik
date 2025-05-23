import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CollegeClass from "./CollegeClass";

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
    expect(screen.getByLabelText(/Periode Akademik/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tahun Kurikulum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prodi Pengampu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sistem Kuliah/i)).toBeInTheDocument();
  });

  it("should allow typing in search input and clicking search", () => {
    const searchInput = screen.getByPlaceholderText(/Cari Kelas Kuliah/i);
    fireEvent.change(searchInput, { target: { value: "Algoritma" } });
    expect((searchInput as HTMLInputElement).value).toBe("Algoritma");

    const buttons = screen.getAllByRole("button");
    const searchButton = buttons.find(
      (btn) => (btn.querySelector("svg") as Element)?.classList.contains("lucide-search")
    );
    fireEvent.click(searchButton!);
  });

  it("should trigger refresh button click", () => {
    const buttons = screen.getAllByRole("button");
    const refreshButton = buttons.find(
      (btn) => (btn.querySelector("svg") as Element)?.classList.contains("lucide-refresh-cw")
    );
    fireEvent.click(refreshButton!);
  });

  it("should trigger click on Tambah button", () => {
    const tambahButton = screen.getByRole("button", { name: /tambah/i });
    fireEvent.click(tambahButton);
    // tambahkan expect bila ada perubahan UI setelah klik
  });

  it("should render checkboxes", () => {
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(1);
  });

  it("should render action buttons per row", () => {
    const buttons = screen.getAllByRole("button");
    const eyeButtons = buttons.filter(
      (btn) => (btn.firstChild as Element)?.getAttribute("data-lucide") === "eye"
    );
    const deleteButtons = buttons.filter(
      (btn) => (btn.firstChild as Element)?.getAttribute("data-lucide") === "trash-2"
    );
    expect(eyeButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

 it("should render pagination", () => {
  renderWithRouter(<CollegeClass />);
  screen.debug(); // debug output
  expect(
    screen.getByText((_, element) =>
      element?.textContent?.includes("Rows per page")
    )
  ).toBeInTheDocument();
});
});
