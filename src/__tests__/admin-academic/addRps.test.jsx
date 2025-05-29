import React from "react";
import {describe, it, expect, vi, beforeEach} from "vitest";


// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock RichTextEditor
vi.mock("../../components/admin-academic/RichTextEditor.js", () => ({
    default: (props) => {
        const [val, setVal] = React.useState(props.value || "");

        return (
            <textarea
                data-testid={`rich-editor-${props.name}`}
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                    props.onChange(e.target.value);
                }}
            />
        );
    }
}));

import {render, screen, fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import AddRps from "../../pages/admin-academic/academic/AddRps";

describe("AddRps Component", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it("renders form title and buttons", () => {
        render(
            <MemoryRouter>
                <AddRps/>
            </MemoryRouter>
        );

        expect(screen.getByText("Tambah RPS")).toBeInTheDocument();
        expect(screen.getByText("Kembali ke Daftar")).toBeInTheDocument();
        expect(screen.getByText("Simpan")).toBeInTheDocument();
    });

    it("navigates back when 'Kembali ke Daftar' clicked", () => {
        render(
            <MemoryRouter>
                <AddRps/>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Kembali ke Daftar"));
        expect(mockNavigate).toHaveBeenCalledWith("/admin-akademik/rps");
    });

    it("updates mata kuliah value correctly", () => {
        render(
            <MemoryRouter>
                <AddRps/>
            </MemoryRouter>
        );

        // Cari semua dropdown (select), dan pilih yang pertama (mata kuliah)
        const selects = screen.getAllByRole("combobox");

        // Pastikan select[0] punya opsi yang kita harapkan
        expect(selects[0]).toHaveDisplayValue("-- Pilih Mata Kuliah --");

        // Ganti nilainya
        fireEvent.change(selects[0], {target: {value: "MK002"}});

        // Cek value-nya udah berubah
        expect(selects[0].value).toBe("MK002");
    });


    it("updates tanggal penyusunan correctly", () => {
        const {container} = render(
            <MemoryRouter>
                <AddRps/>
            </MemoryRouter>
        );

        // Cari input type date dengan atribut name="tanggalPenyusunan"
        const tanggalInput = container.querySelector('input[name="tanggalPenyusunan"]');
        expect(tanggalInput).not.toBeNull();

        fireEvent.change(tanggalInput, {target: {value: "2025-06-01"}});
        expect(tanggalInput.value).toBe("2025-06-01");
    });

    it("handles file upload correctly", () => {
        render(
            <MemoryRouter>
                <AddRps />
            </MemoryRouter>
        );

        const file = new File(["dummy content"], "test.pdf", {
            type: "application/pdf",
        });

        const inputFile = screen.getByLabelText(/Dokumen RPS/i);

        fireEvent.change(inputFile, {
            target: { files: [file] },
        });

        expect(inputFile.files[0]).toStrictEqual(file);

        // Cek apakah nama file muncul di UI
        expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument();
    });


    it("updates rich text editor content", () => {
        render(
            <MemoryRouter>
                <AddRps/>
            </MemoryRouter>
        );

        const textarea = screen.getByTestId("rich-editor-capaianMataKuliah");
        fireEvent.change(textarea, {target: {value: "Capaian baru"}});
        expect(textarea.value).toBe("Capaian baru");
    });


    it("calls console.log on save with correct data", () => {
        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        });
        render(
            <MemoryRouter>
                <AddRps/>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Simpan"));
        expect(consoleSpy).toHaveBeenCalledWith(
            "Data disimpan:",
            expect.objectContaining({
                mataKuliah: "",
                tanggalPenyusunan: "",
                dosenPenyusun: "",
                dokumenRps: null,
            })
        );
        consoleSpy.mockRestore();
    });
});
