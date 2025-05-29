import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ScaleAdminAcademic from "../../pages/admin-academic/setting/ScaleAdminAcademic";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// MOCK MainLayout agar tidak membebani UI
vi.mock("../../components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// MOCK FilterDropdown agar kita bisa tes dropdown Jenjang/Prodi
vi.mock("../../components/admin-academic/FilterDropdown", () => ({
  default: ({ title, options }: { title: string; options: string[] }) => (
    <div>
      <label htmlFor={title}>{title}</label>
      <select id={title} data-testid={`dropdown-${title}`}>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  ),
}));

// MOCK TableSetting dengan tombol aksi
vi.mock("../../components/admin-academic/setting/TableSetting", () => ({
  default: ({ data }) => (
    <table>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.grade}</td>
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

describe("Unit test ScaleAdminAcademic.tsx", () => {
  it("render dropdown Jenjang (prodi pengampu)", () => {
    render(<MemoryRouter><ScaleAdminAcademic /></MemoryRouter>);
    const dropdown = screen.getByTestId("dropdown-Jenjang");
    expect(dropdown).toBeInTheDocument();
  });

  it("klik tombol tambah", () => {
    render(<MemoryRouter><ScaleAdminAcademic /></MemoryRouter>);
    const addButton = screen.getByText("Tambah");
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  it("render tombol Edit di tabel", () => {
    window.alert = vi.fn();
    render(<MemoryRouter><ScaleAdminAcademic /></MemoryRouter>);
    const editButton = screen.getAllByText("Edit");
    fireEvent.click(editButton[0]);
    expect(window.alert).toHaveBeenCalledWith("Edit");
  });

  it("render tombol Hapus di tabel", () => {
    window.alert = vi.fn();
    render(<MemoryRouter><ScaleAdminAcademic /></MemoryRouter>);
    const deleteButton = screen.getAllByText("Hapus");
    fireEvent.click(deleteButton[0]);
    expect(window.alert).toHaveBeenCalledWith("Hapus");
  });

  it("render tombol Simpan di tabel", () => {
    window.alert = vi.fn();
    render(<MemoryRouter><ScaleAdminAcademic /></MemoryRouter>);
    const saveButton = screen.getAllByText("Simpan");
    fireEvent.click(saveButton[0]);
    expect(window.alert).toHaveBeenCalledWith("Simpan");
  });
});
