import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App"; 
import { MemoryRouter } from "react-router-dom";

describe("Mahasiswa Menu Navigation", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  test("Navigates to Jadwal submenu", () => {
    fireEvent.click(screen.getByText("Jadwal"));
    expect(screen.getByText("Pengumuman")).toBeInTheDocument();
    expect(screen.getByText("Kalender Akademik")).toBeInTheDocument();
    expect(screen.getByText("Jadwal Minggu Ini")).toBeInTheDocument();
    expect(screen.getByText("Jadwal Semester")).toBeInTheDocument();
  });

  test("Opens Pengumuman page", () => {
    fireEvent.click(screen.getByText("Jadwal"));
    fireEvent.click(screen.getByText("Pengumuman"));
    expect(screen.getByText(/pengumuman/i)).toBeInTheDocument();
  });

  test("Opens Kalender Akademik page", () => {
    fireEvent.click(screen.getByText("Jadwal"));
    fireEvent.click(screen.getByText("Kalender Akademik"));
    expect(screen.getByText(/kalender akademik/i)).toBeInTheDocument();
  });

  test("Navigates to Akademik submenu", () => {
    fireEvent.click(screen.getByText("Akademik"));
    expect(screen.getByText("Pengisian Kartu Rencana Studi")).toBeInTheDocument();
    expect(screen.getByText("Riwayat KRS")).toBeInTheDocument();
    expect(screen.getByText("Mengulang")).toBeInTheDocument();
    expect(screen.getByText("Nilai Mahasiswa")).toBeInTheDocument();
  });

  test("Navigates to Tingkat Akhir submenu", () => {
    fireEvent.click(screen.getByText("Tingkat Akhir"));
    expect(screen.getByText("Konsultasi")).toBeInTheDocument();
    expect(screen.getByText("Kegiatan Pendukung")).toBeInTheDocument();
    expect(screen.getByText("Daftar Proposal")).toBeInTheDocument();
    expect(screen.getByText("Daftar Tugas Akhir")).toBeInTheDocument();
    expect(screen.getByText("Pengajuan Yudisium")).toBeInTheDocument();
    expect(screen.getByText("Pengajuan Wisuda")).toBeInTheDocument();
  });

  test("Navigates to Hasil Studi submenu", () => {
    fireEvent.click(screen.getByText("Hasil Studi"));
    expect(screen.getByText("Kartu Hasil Studi")).toBeInTheDocument();
    expect(screen.getByText("Transkip")).toBeInTheDocument();
  });

  test("Navigates to Keuangan submenu", () => {
    fireEvent.click(screen.getByText("Keuangan"));
    expect(screen.getByText("Tagihan Mahasiswa")).toBeInTheDocument();
    expect(screen.getByText("Riwayat Keuangan")).toBeInTheDocument();
  });

  test("Navigates to Profile submenu", () => {
    fireEvent.click(screen.getByText("Profile"));
    expect(screen.getByText("Data Mahasiswa")).toBeInTheDocument();
    expect(screen.getByText("Status Semester")).toBeInTheDocument();
    expect(screen.getByText("Kemajuan Belajar")).toBeInTheDocument();
    expect(screen.getByText("Berhenti Studi")).toBeInTheDocument();
    expect(screen.getByText("Bahasa Aplikasi")).toBeInTheDocument();
    expect(screen.getByText("Bantuan")).toBeInTheDocument();
    expect(screen.getByText("Keluar")).toBeInTheDocument();
  });

  test("Logs out when Keluar is clicked", () => {
    fireEvent.click(screen.getByText("Profile"));
    fireEvent.click(screen.getByText("Keluar"));
    expect(screen.queryByText("Profile")).not.toBeInTheDocument(); // example behavior after logout
  });
});
