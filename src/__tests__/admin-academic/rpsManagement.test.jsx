import React from "react";
import {describe, it, expect, vi, beforeEach} from "vitest";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import RpsManagement from "../../pages/admin-academic/academic/RpsManagement.js";
import { MemoryRouter } from "react-router-dom";
import {BrowserRouter} from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderWithRouter = (props = {}) =>
    render(
        <BrowserRouter>
            <RpsManagement {...props} />
        </BrowserRouter>
    );

describe("RpsManagement Component", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it("renders title correctly", () => {
        renderWithRouter();
        expect(screen.getByText("Manajemen RPS")).toBeInTheDocument();
    });

    it("displays all filter dropdowns", () => {
        renderWithRouter();
        const dropdowns = screen.getAllByRole("combobox");
        expect(dropdowns).toHaveLength(5); // 4 dropdown + 1 pagination select
        expect(screen.getByDisplayValue("2021")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2025 Genap")).toBeInTheDocument();
        expect(screen.getByDisplayValue("S1 - Teknik Informatika")).toBeInTheDocument();
        expect(screen.getByDisplayValue("-- Semua Status --")).toBeInTheDocument();
    });

    it("has working search and add buttons", () => {
        renderWithRouter();
        expect(screen.getByPlaceholderText("Cari Program Studi")).toBeInTheDocument();
        expect(screen.getByText(/Tambah/i)).toBeInTheDocument();
    });

    it("navigates to add page on Tambah click", () => {
        renderWithRouter();
        fireEvent.click(screen.getByText(/Tambah/i));
        expect(mockNavigate).toHaveBeenCalledWith("/admin-akademik/rps/tambah-rps");
    });

    it("shows initial RPS data", () => {
        renderWithRouter();
        expect(screen.getByText("Algoritma dan Pemrograman")).toBeInTheDocument();
        expect(screen.getByText("Struktur Data")).toBeInTheDocument();
        expect(screen.getByText("Basis Data")).toBeInTheDocument();
    });

    it("deletes RPS item correctly", async () => {
        renderWithRouter();
        const deleteButtons = screen.getAllByRole("button", {name: /hapus/i});
        fireEvent.click(deleteButtons[0]);
        await waitFor(() => {
            expect(screen.queryByText("Algoritma dan Pemrograman")).not.toBeInTheDocument();
        });
    });

    it("should call onEdit with correct id when edit button clicked", () => {
        const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(
            <MemoryRouter>
                <RpsManagement />
            </MemoryRouter>
        );

        const editButtons = screen.getAllByRole("button", { name: /edit/i });
        expect(editButtons.length).toBeGreaterThan(0);

        fireEvent.click(editButtons[0]);

        expect(consoleLogSpy).toHaveBeenCalledWith("Edit id:", 1);

        consoleLogSpy.mockRestore();
    });


    it("changes items per page", () => {
        renderWithRouter();
        const select = screen.getAllByRole("combobox").pop(); // dropdown terakhir = pagination
        fireEvent.change(select, {target: {value: "25"}});
        expect(select).toHaveValue("25");
    });
});
