import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import '@testing-library/jest-dom';


// ✅ Mocking useNavigate sebelum import komponen
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import FormLogin from "../components/FormLogin";

// Helper render pakai Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("FormLogin validation", () => {
  beforeEach(() => {
    mockNavigate.mockReset(); // bersihkan state sebelum tiap test
  });

  test("valid input: navigates to dashboard", () => {
    renderWithRouter(<FormLogin />);

    fireEvent.change(screen.getByPlaceholderText(/NPM/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Masukan kode diatas/i), {
      target: { value: "abc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("empty fields show all errors", () => {
    renderWithRouter(<FormLogin />);

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(screen.getByText(/NPM tidak boleh kosong/i)).toBeInTheDocument();
    expect(screen.getByText(/Password tidak boleh kosong/i)).toBeInTheDocument();
    expect(screen.getByText(/Captcha tidak boleh kosong/i)).toBeInTheDocument();
    expect(screen.getByText(/Akun Pengguna dan Password harus diisi/i)).toBeInTheDocument();
  });

  test("NPM only → password error shown", () => {
    renderWithRouter(<FormLogin />);

    fireEvent.change(screen.getByPlaceholderText(/NPM/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Masukan kode diatas/i), {
      target: { value: "abc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(screen.queryByText(/NPM tidak boleh kosong/i)).toBeNull();
    expect(screen.getByText(/Password tidak boleh kosong/i)).toBeInTheDocument();
  });

  test("Password only → NPM error shown", () => {
    renderWithRouter(<FormLogin />);

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Masukan kode diatas/i), {
      target: { value: "abc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(screen.getByText(/NPM tidak boleh kosong/i)).toBeInTheDocument();
    expect(screen.queryByText(/Password tidak boleh kosong/i)).toBeNull();
  });
});
