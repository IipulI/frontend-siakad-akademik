import React from 'react';
import { render, screen } from "@testing-library/react";
import Retake from "../pages/academic/Retake";
import { describe, it, expect, vi } from "vitest";

// Mock layout dan table agar tidak tergantung implementasi aslinya
vi.mock("../../components/layouts/MainLayout", () => {
    return {
        default: ({ children, titlePage }) => (
            <div>
                <h1>{titlePage}</h1>
                {children}
            </div>
        ),
    };
});

vi.mock("../../components/Biodata", () => {
    return {
        default: () => (
            <div>
                <p>NIM: 2211060042807</p>
                <p>Nama Mahasiswa: Muhammad Ridho Fatan</p>
                <p>Program Studi: Teknik Informatika</p>
            </div>
        ),
    };
});

vi.mock("../../components/Table", () => {
    return {
        default: ({ error }) => (
            <div>
                <p>{error}</p>
            </div>
        ),
    };
});

describe("Retake Page", () => {
    it("Menampilkan title Mengulang", () => {
        render(<Retake />);
        expect(screen.getAllByText(/Mengulang/i)[0]).toBeInTheDocument();
    });

    it("Menampilkan biodata mahasiswa", () => {
        render(<Retake />);
        expect(screen.getByText(/2211060042807/i)).toBeInTheDocument();
        expect(screen.getByText(/muhammad ridho fatan/i)).toBeInTheDocument();
        expect(screen.getByText(/teknik informatika/i)).toBeInTheDocument();
    });

    it("Menampilkan tabel dengan pesan error jika data kosong", () => {
        render(<Retake />);
        expect(screen.getByText(/Mahasiswa tidak pernah mengulang mata kuiah/i)).toBeInTheDocument();
    });
});
