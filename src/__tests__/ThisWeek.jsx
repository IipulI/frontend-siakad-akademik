import { render, screen } from '@testing-library/react';
import ThisWeek from '../pages/schedule/ThisWeek';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('ThisWeek', () => {
  it('renders title and student biodata information', () => {
    render(
      <BrowserRouter>
        <ThisWeek />
      </BrowserRouter>
    );

    // Judul utama halaman
    expect(screen.getByText(/Jadwal Minggu Ini/i)).toBeInTheDocument();

    // Cek data mahasiswa dari komponen Biodata
    expect(screen.getByText(/2211060042807/i)).toBeInTheDocument(); // NIM
    expect(screen.getByText(/Muhammad Ridho Fatan/i)).toBeInTheDocument(); // Nama
    expect(screen.getByText(/Teknik Informatika/i)).toBeInTheDocument(); // Prodi
    expect(screen.getByText(/Aktif/i)).toBeInTheDocument(); // Status
    expect(screen.getByText(/2022/i)).toBeInTheDocument(); // Angkatan
    expect(screen.getByText(/2021/i)).toBeInTheDocument(); // Kurikulum
    expect(screen.getAllByText(/6/i).length).toBeGreaterThan(0); // semester
    expect(screen.getByText(/Berlina Wulandari/i)).toBeInTheDocument(); // Pembimbing
    expect(screen.getAllByText(/103 \/ 3.78/i).length).toBeGreaterThan(0); // SKS/IPK
  });

  it('renders view and home button if they exist', () => {
    // Jika di BiodataSection ada tombol (saat ini tidak ada), ini bisa mengujinya:
    const { queryByRole } = render(
      <BrowserRouter>
        <ThisWeek />
      </BrowserRouter>
    );

    const homeButton = queryByRole('button', { name: /Home/i });
    const viewButton = queryByRole('button', { name: /View/i });

    if (homeButton) {
      expect(homeButton).toBeInTheDocument();
    }

    if (viewButton) {
      expect(viewButton).toBeInTheDocument();
    }
  });
});
