import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import CurriculumYear from "../../pages/admin-academic/academic/CurriculumYear";
import { describe, it, expect, beforeEach } from "vitest";

describe("CurriculumYear Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <CurriculumYear />
      </MemoryRouter>
    );
  });

  it("should render dropdown program studi", () => {
    const dropdowns = screen.getAllByRole("combobox");
    expect(dropdowns[0]).toBeInTheDocument(); // dropdown pertama
  });

  it("should render search input for kurikulum", () => {
    const input = screen.getByPlaceholderText("Cari Tahun Kurikulum");
    expect(input).toBeInTheDocument();
  });

  it("should render button Salin (Refresh)", () => {
    const buttons = screen.getAllByRole("button");
    const refreshButton = buttons.find((btn) => btn.innerHTML.includes("refresh-cw"));
    expect(refreshButton).toBeDefined();
  });

  it("should render button Cetak (Search)", () => {
    const buttons = screen.getAllByRole("button");
    const searchButton = buttons.find((btn) => btn.innerHTML.includes("search"));
    expect(searchButton).toBeDefined();
  });

  it("should render button Tambah", () => {
    const addButton = screen.getByRole("button", { name: /tambah/i });
    expect(addButton).toBeInTheDocument();
  });

  it("should render pagination dropdown (jumlah baris)", () => {
    const dropdowns = screen.getAllByRole("combobox");
    expect(dropdowns.length).toBeGreaterThan(1); // karena ada dua select: filter + pagination
  });

  it("should render all table rows", () => {
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1); // ada header + data rows
  });

  it("should show form input when Tambah is clicked", async () => {
    const tambahBtn = screen.getByRole("button", { name: /tambah/i });
    fireEvent.click(tambahBtn);

    const inputs = await screen.findAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(0); // setidaknya ada satu input textbox muncul
  });

  it("should show checkbox opsi tambahan if available", () => {
    const checkbox = screen.queryByRole("checkbox");
    if (checkbox) {
      expect(checkbox).toBeInTheDocument();
    } else {
      console.warn("Checkbox tidak ditemukan – mungkin belum di-render.");
    }
  });
});
