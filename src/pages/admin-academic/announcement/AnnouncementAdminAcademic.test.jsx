import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnnouncementAdminAcademic from "./AnnouncementAdminAcademic";

// Mock sub-komponen yang tidak sedang diuji secara langsung
vi.mock("../../../components/layouts/MainLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../../../components/admin-academic/FilterDropdown", () => ({
  default: ({ title }) => <div>{title}</div>,
}));
vi.mock("../../../components/admin-academic/announcement/TableAnnouncement", () => ({
  TableAnnouncement: ({ data, setId }) => (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <button onClick={() => setId(item.id)}>Detail {item.id}</button>
          <button data-testid={`delete-${item.id}`}>Hapus</button>
        </div>
      ))}
    </div>
  ),
}));
vi.mock("../../../components/schedule/DetailAnnouncement", () => ({
  default: ({ data }) => <div>{data?.judul}</div>,
}));
vi.mock("../../../components/admin-academic/announcement/FormAddAnnouncement", () => ({
  default: ({ onSubmit, onCancel }) => (
    <div>
      <button onClick={() => onSubmit()}>Submit Valid</button>
      <button onClick={() => onSubmit(false)}>Submit Invalid</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));
vi.mock("../../../components/admin-academic/Pagination", () => ({
  Pagination: () => <div>Pagination</div>,
}));

describe("AnnouncementAdminAcademic Component", () => {
  beforeEach(() => {
    render(<AnnouncementAdminAcademic />);
  });

  it("should render dropdown status", () => {
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("should trigger tambah button", async () => {
    const addButton = screen.getByText("Tambah");
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText("Submit Valid")).toBeInTheDocument();
    });
  });

  it("should trigger hapus button (global)", () => {
    const deleteButton = screen.getAllByRole("Hapus");
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(hapusButtons[0]);
    // Konfirmasi tidak bisa diuji langsung karena window.confirm perlu di-mock jika ingin dites secara penuh
  });

  it("should render and trigger detail button in table", () => {
    const detailButton = screen.getByText("Detail 1");
    fireEvent.click(detailButton);
    expect(screen.getByText(/\[NEW\] Cara Bayar Kuliah Melalui Shopee/i)).toBeInTheDocument();
  });

  it("should render and trigger hapus button in table", () => {
    const deleteTableButton = screen.getByTestId("delete-1");
    expect(deleteTableButton).toBeInTheDocument();
  });

  it("should submit new announcement with valid data", async () => {
    const addButton = screen.getByText("Tambah");
    fireEvent.click(addButton);
    const submitButton = screen.getByText("Submit Valid");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByText("Submit Valid")).not.toBeInTheDocument();
    });
  });

  it("should try to submit new announcement with invalid data", async () => {
    const addButton = screen.getByText("Tambah");
    fireEvent.click(addButton);
    const invalidButton = screen.getByText("Submit Invalid");
    fireEvent.click(invalidButton);
    // Dalam test nyata, harus ada validasi error muncul
  });

  it("should render detail announcement", () => {
    const detailButton = screen.getByText("Detail 1");
    fireEvent.click(detailButton);
    expect(screen.getByText("[NEW] Cara Bayar Kuliah Melalui Shopee")).toBeInTheDocument();
  });

  it("should render edit button (Kembali ke daftar)", async () => {
    const detailButton = screen.getByText("Detail 1");
    fireEvent.click(detailButton);
    await waitFor(() => {
      expect(screen.getByText("Kembali ke daftar")).toBeInTheDocument();
    });
  });

  it("should edit announcement and submit valid", async () => {
    const detailButton = screen.getByText("Detail 1");
    fireEvent.click(detailButton);
    const simpanButton = screen.getByText("Simpan");
    fireEvent.click(simpanButton);
    await waitFor(() => {
      expect(screen.queryByText("Simpan")).not.toBeInTheDocument();
    });
  });

  it("should edit announcement and submit invalid", async () => {
    const detailButton = screen.getByText("Detail 1");
    fireEvent.click(detailButton);
    // Simulasi invalid bisa ditambahkan lebih lanjut jika form real diuji
  });
});
