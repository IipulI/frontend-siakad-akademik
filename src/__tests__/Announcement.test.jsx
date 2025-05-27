import React from 'react';
import { render, screen } from "@testing-library/react";
import Announcement from "../pages/schedule/Announcement";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock MainLayout yang berisi link home
vi.mock("../../components/layouts/MainLayout", () => {
    const React = require('react');
    return {
        default: ({ children }) => (
            <div>
                <a href="/">Home</a>
                {children}
            </div>
        ),
    };
});

// Mock Table agar judul pengumuman muncul
vi.mock("../../components/Table", () => {
    const React = require('react');
    return {
        default: ({ data }) => (
            <div>
                {data.map((item) => (
                    <div key={item.id}>{item.judul}</div>
                ))}
            </div>
        ),
    };
});

describe("Announcement Component", () => {
    it("Menampilkan semua option --Semua--", () => {
        render(<Announcement />);
        expect(screen.getByRole("option", { name: /--semua--/i })).toBeInTheDocument();
    });

    it("Menampilkan search input dan buttonnya", () => {
        render(<Announcement />);
        expect(screen.getByPlaceholderText(/cari pengumuman/i)).toBeInTheDocument();
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it("Menampilkan list data-data pengumuman", () => {
        render(<Announcement />);
        expect(screen.getByText("[NEW] Cara Bayar Kuliah Melalui Shopee")).toBeInTheDocument();
        expect(screen.getByText("Cara bayar kuliah melalui Tokopedia")).toBeInTheDocument();
        expect(screen.getByText("Cara bayar kuliah melalui Bank Muamalat")).toBeInTheDocument();
    });
});

describe("Announcement Component", () => {
  it("Link Home memiliki href ke /dashboard", () => {
      render(<Announcement />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
  });
});
