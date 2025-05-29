import { render, screen, fireEvent } from "@testing-library/react";
import YearAdminAcademic from "../../pages/admin-academic/setting/YearAdminAcademic";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mocks
vi.mock("../../components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("../../components/admin-academic/setting/TableSetting", () => ({
  default: ({ tableHead, data }) => (
    <table>
      <thead>
        <tr>
          {tableHead.map((head, idx) => (
            <th key={idx}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.tahun}</td>
            <td>{row.namaTahun}</td>
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

describe("Pengujian YearAdminAcademic", () => {
  it("memunculkan dropdown filter", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const dropdowns = screen.getAllByRole("combobox");
    expect(dropdowns[0]).toBeInTheDocument(); 
  });

  it("bisa input search tahun ajaran", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText("Cari Pengumuman");
    fireEvent.change(input, { target: { value: "2024" } });
    expect(input).toHaveValue("2024");
  });

  it("klik tombol search", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const btn = screen.getAllByRole("button")[0]; // Search icon
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("klik tombol refresh", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const btn = screen.getAllByRole("button")[1]; // Refresh icon
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("klik tombol tambah", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const btn = screen.getByText("Tambah");
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it("dropdown batas maksimal pagination bisa diubah", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const dropdown = screen.getAllByRole("combobox")[1]; // Index ke-1: pagination
    fireEvent.change(dropdown, { target: { value: "5" } });
    expect(dropdown).toHaveValue("5");
  });

  it("klik tombol next pagination", () => {
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const nextBtn = screen.getByText("Next");
    fireEvent.click(nextBtn);
    expect(nextBtn).toBeInTheDocument();
  });

  it("klik tombol edit", () => {
    window.alert = vi.fn();
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const editBtn = screen.getAllByText("Edit");
    fireEvent.click(editBtn[0]);
    expect(window.alert).toHaveBeenCalledWith("Edit");
  });

  it("klik tombol hapus", () => {
    window.alert = vi.fn();
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const deleteBtn = screen.getAllByText("Hapus");
    fireEvent.click(deleteBtn[0]);
    expect(window.alert).toHaveBeenCalledWith("Hapus");
  });

  it("klik tombol simpan", () => {
    window.alert = vi.fn();
    render(
      <MemoryRouter>
        <YearAdminAcademic />
      </MemoryRouter>
    );
    const saveBtn = screen.getAllByText("Simpan")[0];
    fireEvent.click(saveBtn);
    expect(window.alert).toHaveBeenCalledWith("Simpan");
  });
});
