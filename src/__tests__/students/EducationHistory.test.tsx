// src/__tests__/student/History.test.tsx

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import History from "../../pages/studentModule/academic/History";

describe("KRS History Page", () => {
  it("renders KRS history page with heading and table", () => {
    render(
      <BrowserRouter>
        <History />
      </BrowserRouter>
    );

    // Cek informasi penting yang pasti muncul
    expect(screen.getByText(/Riwayat KRS/i)).toBeInTheDocument();
    expect(screen.getByText(/Periode Akademik/i)).toBeInTheDocument();
    expect(screen.getByText(/Telah Divalidasi/i)).toBeInTheDocument();
    expect(screen.getByText(/Kode MK/i)).toBeInTheDocument(); // kolom header tabel

    // Cek apakah nama mata kuliah tampil
    expect(screen.getByText(/Metode Penelitian/i)).toBeInTheDocument();
    expect(screen.getByText(/Kapita Selekta/i)).toBeInTheDocument();
    expect(screen.getByText(/Pemrograman Web/i)).toBeInTheDocument();
  });
});
