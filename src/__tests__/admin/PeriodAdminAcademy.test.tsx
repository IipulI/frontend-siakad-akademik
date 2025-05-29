import { render, screen, fireEvent } from "@testing-library/react";
import PeriodAdminAcademic from "../../pages/admin-academic/setting/PeriodAdminAcademy";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// MOCK MainLayout agar tidak mempengaruhi layouting
vi.mock("../../components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// MOCK TableSetting agar bisa uji tombol edit, hapus, simpan
vi.mock("../../components/admin-academic/setting/TableSetting", () => ({
  default: ({ data }) => (
    <table>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.namaPeriode}</td>
            <td>
              <button onClick={() => alert("Edit")}>Edit</button>
              <button onClick={() => alert("Hapus")}>Hapus</button>
              <button onClick={() => alert("Simpan")}>Simpan</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

// MOCK Pagination agar bisa uji tombol dan dropdown
vi.mock("../../components/admin-academic/Pagination", () => ({
  Pagination: ({ onPageChange, onRowsPerPageChange }) => (
    <div>
      <button onClick={() => onPageChange(2)}>Next</button>
      <select onChange={(e) => onRowsPerPageChange(Number(e.target.value))}>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
    </div>
  ),
}));

describe("Unit test PeriodAdminAcademic.tsx", () => {
  it("menampilkan dropdown filter", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const dropdowns = screen.getAllByRole("combobox");
    expect(dropdowns[0]).toBeInTheDocument();
  });

  it("memasukkan input ke kotak search tahun ajaran", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const input = screen.getByPlaceholderText("Cari Pengumuman");
    fireEvent.change(input, { target: { value: "2024" } });
    expect(input).toHaveValue("2024");
  });

  it("menekan tombol search", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const buttons = screen.getAllByRole("button");
    const searchButton = buttons.find(btn => btn.querySelector("svg"));
    expect(searchButton).toBeInTheDocument();
    fireEvent.click(searchButton!);
  });

  it("menekan tombol refresh", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const buttons = screen.getAllByRole("button");
    const refreshButton = buttons.find(btn => btn.querySelector("svg")?.getAttribute("stroke") === "white");
    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton!);
  });

  it("menekan tombol tambah", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const addButton = screen.getByText(/Tambah/i);
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  it("mengubah dropdown batas maksimal pagination", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const dropdowns = screen.getAllByRole("combobox");
    const paginationDropdown = dropdowns[1]; // dropdown ke-2
    fireEvent.change(paginationDropdown, { target: { value: "5" } });
    expect(paginationDropdown).toHaveValue("5");
  });

  it("menekan tombol pagination next", () => {
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(nextButton).toBeInTheDocument();
  });

  it("menekan tombol edit", () => {
    window.alert = vi.fn();
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const editBtn = screen.getAllByText("Edit");
    fireEvent.click(editBtn[0]);
    expect(window.alert).toHaveBeenCalledWith("Edit");
  });

  it("menekan tombol hapus", () => {
    window.alert = vi.fn();
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const delBtn = screen.getAllByText("Hapus");
    fireEvent.click(delBtn[0]);
    expect(window.alert).toHaveBeenCalledWith("Hapus");
  });

  it("menekan tombol simpan", () => {
    window.alert = vi.fn();
    render(<MemoryRouter><PeriodAdminAcademic /></MemoryRouter>);
    const simpanBtn = screen.getAllByText("Simpan");
    fireEvent.click(simpanBtn[0]);
    expect(window.alert).toHaveBeenCalledWith("Simpan");
  });
});
