import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

// Mock semua komponen yang di-import di dalam Dashboard
vi.mock("../components/DashboardSubjectCard", () => ({
  default: () => <div data-testid="subject-card">Mock Subject Card</div>,
}));
vi.mock("../components/DashboardBillCard", () => ({
  default: () => <div data-testid="bill-card">Mock Bill Card</div>,
}));
vi.mock("../components/DashboardCardAcademic", () => ({
  default: () => <div data-testid="academic-card">Mock Academic Card</div>,
}));
vi.mock("../components/DashboardAnnouncementCard", () => ({
  default: () => <div data-testid="announcement-card">Mock Announcement</div>,
}));
vi.mock("../components/layouts/MainLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../components/chart/IPSChart", () => ({
  default: () => <div data-testid="ips-chart">Mock IPS Chart</div>,
}));

describe("Dashboard Page", () => {
  it("renders Dashboard page and main headings", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Ubah semua ke getAllByText karena ada duplikat kata
    expect(screen.getAllByText(/Jadwal/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Status Keuangan/i)).toBeInTheDocument();
    expect(screen.getByText(/Grafik Akademik/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Akademik/i)[1]).toBeInTheDocument(); // Akademik yang bukan di Grafik
    expect(screen.getByText(/Pengumuman/i)).toBeInTheDocument();

    // Pastikan semua komponen utama ter-render
    expect(screen.getAllByTestId("subject-card")).toHaveLength(2);
    expect(screen.getAllByTestId("bill-card")).toHaveLength(3);
    expect(screen.getByTestId("ips-chart")).toBeInTheDocument();
    expect(screen.getAllByTestId("academic-card")).toHaveLength(4);
    expect(screen.getAllByTestId("announcement-card")).toHaveLength(2);
  });
});
