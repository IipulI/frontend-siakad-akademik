import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import DetailCollegeClass from "../../pages/admin-academic/class/DetailCollegeClass";
import { MemoryRouter } from "react-router-dom";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Pengujian Form Jadwal Mata Kuliah", () => {
  it("Submit tambah data jadwal mata kuliah dengan data valid", () => {
    render(
      <MemoryRouter>
        <DetailCollegeClass />
      </MemoryRouter>
    );

    // Klik tombol Tambah Jadwal
    const addButton = screen.getByText("Tambah Jadwal");
    fireEvent.click(addButton);

    // Pilih semua dropdown (simulasi isi valid)
    const selects = screen.getAllByRole("combobox");
    selects.forEach((select) => {
      fireEvent.change(select, { target: { value: "Valid Option" } });
    });

    // Klik tombol Simpan
    const saveButton = screen.getByText("Simpan");
    window.alert = vi.fn(); // Mock alert
    fireEvent.click(saveButton);

    expect(window.alert).toHaveBeenCalledWith("save");
  });

  it("Submit tambah data jadwal mata kuliah dengan data tidak valid", () =>  {
    render(
      <MemoryRouter>
        <DetailCollegeClass />
      </MemoryRouter>
    );


    // Klik tombol Tambah Jadwal
    const addButton = screen.getByText("Tambah Jadwal");
    fireEvent.click(addButton);

    // Jangan isi data (biarkan kosong)

    // Klik tombol Simpan
    window.alert = vi.fn(); // Mock alert
    const saveButton = screen.getByText("Simpan");
    fireEvent.click(saveButton);

    // Karena tidak ada validasi secara langsung, jadi masih  enampilkan alert
    expect(window.alert).toHaveBeenCalledWith("save");
 
  });

  it("Edit data jadwal mata kuliah", () => 
     {
    render(
      <MemoryRouter>
        <DetailCollegeClass />
      </MemoryRouter>
    );


    // Tambah jadwal
    const addButton = screen.getByText("Tambah Jadwal");
    fireEvent.click(addButton);

    // Ubah salah satu field (misal dropdown pertama)
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Senin" } });

    // Klik Simpan
    window.alert = vi.fn();
    const saveButton = screen.getByText("Simpan");
    fireEvent.click(saveButton);

    expect(window.alert).toHaveBeenCalledWith("save");
  });
});

describe("DetailCollegeClass", () => {
  beforeEach(() => {
    renderWithRouter(<DetailCollegeClass />);
  });

  it("navigasi tab RPS dan memunculkan isi RPS", () => {
    fireEvent.click(screen.getByRole("button", { name: /rps/i }));
    expect(screen.getAllByText(/mata kuliah/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/dokumen rps/i)).toBeInTheDocument();
  });

//   buat test button tambah jadwal 
  it("klik tombol Tambah Jadwal menambah baris tabel", () => {
    const initialRows = screen.getAllByRole("row");
    fireEvent.click(screen.getByRole("button", { name: /tambah jadwal/i }));
    const newRows = screen.getAllByRole("row");
    expect(newRows.length).toBeGreaterThan(initialRows.length);
  });

  it("klik tombol Tambah Dosen Pengajar memicu alert", () => {
    fireEvent.click(screen.getByRole("button", { name: /dosen pengajar/i }));
    window.alert = vi.fn();
    fireEvent.click(screen.getByRole("button", { name: /tambah dosen pengajar/i }));
    expect(window.alert).toHaveBeenCalledWith("Tambah Dosen Pengajar");
  });

  it("klik tombol Tambah Peserta memicu alert", () => {
    fireEvent.click(screen.getByRole("button", { name: /peserta kelas/i }));
    window.alert = vi.fn();
    fireEvent.click(screen.getByRole("button", { name: /tambah/i }));
    expect(window.alert).toHaveBeenCalledWith("tambah");
  });

  it("klik tombol Hapus Peserta memicu alert", () => {
    fireEvent.click(screen.getByRole("button", { name: /peserta kelas/i }));
    window.alert = vi.fn();
    fireEvent.click(screen.getByRole("button", { name: /hapus/i }));
    expect(window.alert).toHaveBeenCalledWith("Hapus");
  });

  it("klik select all checkbox peserta", () => {
    fireEvent.click(screen.getByRole("button", { name: /peserta kelas/i }));
    const selectAll = screen.getAllByRole("checkbox")[0];
    fireEvent.click(selectAll);
    screen.getAllByRole("checkbox").forEach((cb) => {
      expect(cb).toBeChecked();
    });
  });
});
