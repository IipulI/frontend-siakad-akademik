import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, expect, describe, it } from "vitest";
import Dashboard from "../../pages/studentModule/Dashboard";
import "@testing-library/jest-dom";

// Mock semua komponen internal yang dipakai oleh Dashboard
vi.mock("../../components/dashboard/DashboardSubjectCard", () => ({
  default: () => <div data-testid="subject-card">Mock Subject Card</div>,
}));
vi.mock("../../components/dashboard/DashboardBillCard", () => ({
  default: () => <div data-testid="bill-card">Mock Bill Card</div>,
}));
vi.mock("../../components/dashboard/DashboardCardAcademic", () => ({
  default: () => <div data-testid="academic-card">Mock Academic Card</div>,
}));
vi.mock("../../components/dashboard/DashboardAnnouncementCard", () => ({
  default: () => <div data-testid="announcement-card">Mock Announcement</div>,
}));
vi.mock("../../components/layouts/MainLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../components/chart/IPSChart", () => ({
  default: () => <div data-testid="ips-chart">Mock IPS Chart</div>,
}));

describe("Dashboard Page", () => {
  it("renders Dashboard page and main headings", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Teks utama
    expect(screen.getAllByText(/Jadwal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Status Keuangan/i)).toBeInTheDocument();
    expect(screen.getByText(/Grafik Akademik/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Akademik/i).length).toBeGreaterThan(0); // ✅ Fix di sini
    expect(screen.getByText(/Pengumuman/i)).toBeInTheDocument();

    // Komponen mock
    expect(screen.getAllByTestId("subject-card").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("bill-card").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("academic-card").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("announcement-card").length).toBeGreaterThan(0);
    expect(screen.getByTestId("ips-chart")).toBeInTheDocument();
  });
});
