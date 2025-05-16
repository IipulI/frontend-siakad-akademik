import React from "react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; 
import Dashboard from "../pages/Dashboard";

beforeEach(() => {
  vi.resetAllMocks(); 
})

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      Link: ({ to, children }) => <a href={to}>{children}</a>, // Simulasikan Link dengan elemen a
      useNavigate: () => vi.fn(), // Jika perlu mock useNavigate
    };
});

vi.mock('react-chartjs-2', () => ({
    Chart: () => <div data-testid="mock-chart" />,
    Line: () => <div data-testid="mock-line-chart" />,
  }));


beforeEach(() => {
    vi.resetAllMocks(); // supaya tiap test mulai bersih
  });

//masuk ke dashboard 
describe("Dashboard", () => {
  //maunya ketika masuk ke dahboard 
    it("Harusnya menampilkan data tagihan", async () => {
      //1. render dashboard 
      render(<Dashboard />);

       // Menunggu elemen untuk muncul dengan `waitFor`
    await screen.findAllByText(/Total Tagihan/);
    await screen.findAllByText(/Total Lunas/);

    // Pengujian apakah elemen ada di dalam dokumen
    const totalTagihan = await screen.findAllByText(/Total Tagihan/);
    const totalLunas = await screen.findAllByText(/Total Lunas/);

    expect(totalTagihan[0]).toBeInTheDocument();
    expect(totalLunas[0]).toBeInTheDocument();
  });
}
);

// kita mau cek dashboard 
describe("Dashboard", () => {
  // apa yang diharapkan ketika masuk ke dashboard 
  it('Menampilkan jadwal kuliah', async () => {
    //kita render dashboard, atau masuk ke dashboard 
    render(<Dashboard/>);

    // cek nama mata kuliah 
    const subject1 = await screen.findByText(/Pemrograman Perangkat Bergerak/);
    const subject2 = await screen.findByText(/Pemrograman Web/);

    // Cek nama dosen 
    const lecturer1 = await screen.findByText(/Fitrah Satrya Fajar/);
    const lecturer2 = await screen.findByText(/Safarrudin Hidayat A. Ikhsan/);

    expect(subject1).toBeInTheDocument();
    expect(subject2).toBeInTheDocument();
    expect(lecturer1).toBeInTheDocument();
    expect(lecturer2).toBeInTheDocument();
  });
});

describe("Dashboard", () => {
  it("Menampilkan pengumuman terbaru", async ()=> {
    render(<Dashboard/>);

    // Cek judul pengumuman di pengumuman
    const pengumuman1 = await screen.findByText(/Cara Bayar Kuliah Melalui Shopee/i);
    const pengumuman2 = await screen.findByText(/Cara Bayar Kuliah Melalui Tokopedia/i);

    // Cek tanggal jika perlu
    const date1 = await screen.findByText(/Kamis , 06-03-2025/i);
    const date2 = await screen.findByText(/Selasa , 19-11-2025/i);

    expect(pengumuman1).toBeInTheDocument();
    expect(pengumuman2).toBeInTheDocument();
    expect(date1).toBeInTheDocument();
    expect(date2).toBeInTheDocument();
  });
});

describe("Dashboard", () => {
  it("Menampilkan grafik akademik", async () => {
    render(<Dashboard/>);

    const chart = await screen.findAllByTestId("mock-line-chart");

    expect(chart[0]).toBeInTheDocument();
  });
});

describe("Dashboard", () => {
  it("menampilkan Data Akademik :  IPS dan IPK", async () => {
    render(<Dashboard />);

    // Judul dan nilai IPS
    const ipsLabel = await screen.findByText(/Jumlah IPS/i);
    const ipsValue = await screen.findByText("3.74");

    // Judul dan nilai IPK
    const ipkLabel = await screen.findByText(/Jumlah IPK/i);
    const ipkValue = await screen.findByText("3.78");

    expect(ipsLabel).toBeInTheDocument();
    expect(ipsValue).toBeInTheDocument();
    expect(ipkLabel).toBeInTheDocument();
    expect(ipkValue).toBeInTheDocument();
  });
});
