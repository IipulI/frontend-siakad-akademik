import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentInformation from "../../pages/studentModule/profile/StudentInformation";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

describe("StudentInformation", () => {
  it("shows Data Diri, Domisili, and Kontak tabs when clicked", async () => {
    render(
      <MemoryRouter>
        <StudentInformation />
      </MemoryRouter>
    );

    const dataDiriTab = screen.getByRole("button", { name: /data diri/i });
    const domisiliTab = screen.getByRole("button", { name: /alamat/i });
    const kontakTab = screen.getByRole("button", { name: /kontak/i });

    expect(dataDiriTab).toBeInTheDocument();
    expect(domisiliTab).toBeInTheDocument();
    expect(kontakTab).toBeInTheDocument();

    await userEvent.click(dataDiriTab);
    expect(screen.getByText(/nama mahasiswa/i)).toBeInTheDocument();

    await userEvent.click(domisiliTab);
    expect(screen.getAllByText(/provinsi/i).length).toBeGreaterThan(0);

    await userEvent.click(kontakTab);
    expect(screen.getByText(/no. whatsapp/i)).toBeInTheDocument();
  });
});
