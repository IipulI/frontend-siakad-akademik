import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementAdminAcademic from "../../pages/admin-academic/announcement/AnnouncementAdminAcademic";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import { vi } from "vitest";

beforeAll(() => {
  window.confirm = vi.fn(() => true);
});
describe("AnnouncementAdminAcademic Component", () => {
  test("render dropdown status", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  test("button tambah opens add form", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const button = screen.getByText("Tambah");
    fireEvent.click(button);
    expect(screen.getByText("Judul Pengumuman")).toBeInTheDocument();
  });

  test("button hapus di header triggers confirm", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const button = screen.getByText("Hapus");
    fireEvent.click(button);
    expect(window.confirm).toHaveBeenCalled();
  });

  test("button detail di table membuka detail pengumuman", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const detailButtons = screen.getAllByText(/Cara bayar/i);
    fireEvent.click(detailButtons[0]);
    expect(screen.getByText("Kembali ke daftar")).toBeInTheDocument();
  });

  test("button hapus di table ada (tanpa aksi karena belum implementasi)", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const deleteIcons = screen.getAllByRole("button", { name: /hapus/i });
    expect(deleteIcons.length).toBeGreaterThan(0);
  });

  test("submit pengumuman baru tidak valid (contoh validasi bisa ditambahkan di form)", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const button = screen.getByText("Tambah");
    fireEvent.click(button);
    const submit = screen.getByText("Simpan");
    fireEvent.click(submit);
    expect(screen.getByText("Judul Pengumuman")).toBeInTheDocument();
  });

  test("detail pengumuman render data", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const detailButtons = screen.getAllByText(/Cara bayar/i);
    fireEvent.click(detailButtons[0]);
    expect(screen.getByText(/Shesil Varista/i)).toBeInTheDocument();
  });

  test("detail pengumuman tombol edit muncul", () => {
    render(
      <MemoryRouter>
        <AnnouncementAdminAcademic />
      </MemoryRouter>
    );
    const detailButtons = screen.getAllByText(/Cara bayar/i);
    fireEvent.click(detailButtons[0]);
    expect(screen.getByText("Simpan")).toBeInTheDocument();
  });
});
