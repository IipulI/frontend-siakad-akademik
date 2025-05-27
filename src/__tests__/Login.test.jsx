import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import FormLogin from "../components/FormLogin";

// Mock useNavigate dari react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Helper untuk render FormLogin
const renderForm = () =>
  render(
    <BrowserRouter>
      <FormLogin />
    </BrowserRouter>
  );

describe("FormLogin", () => {
  const fillAndSubmit = (npm = "", password = "", captcha = "") => {
    if (npm) fireEvent.change(screen.getByPlaceholderText("NPM"), { target: { value: npm } });
    if (password) fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: password } });
    if (captcha) fireEvent.change(screen.getByPlaceholderText("Masukan kode diatas"), { target: { value: captcha } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));
  };

  it("✅ NPM dan Password valid", () => {
    renderForm();
    fillAndSubmit("12345678", "passwordBenar", "captcha");

    expect(screen.queryByText(/harus diisi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tidak boleh kosong/i)).not.toBeInTheDocument();
  });

  it("❌ NPM dan Password tidak valid (isi tapi salah)", () => {
    renderForm();
    fillAndSubmit("salahNPM", "salahPassword", "captcha");

    expect(screen.queryByText(/harus diisi/i)).not.toBeInTheDocument();
  });

  it("❌ NPM dan Password kosong", () => {
    renderForm();
    fillAndSubmit("", "", "");

    expect(screen.getByText("NPM tidak boleh kosong")).toBeInTheDocument();
    expect(screen.getByText("Password tidak boleh kosong")).toBeInTheDocument();
    expect(screen.getByText("Captcha tidak boleh kosong")).toBeInTheDocument();
    expect(screen.getByText("Akun Pengguna dan Password harus diisi")).toBeInTheDocument();
  });

  it("⚠️ NPM valid, Password kosong", () => {
    renderForm();
    fillAndSubmit("12345678", "", "captcha");

    expect(screen.getByText("Password tidak boleh kosong")).toBeInTheDocument();
    expect(screen.getByText("Akun Pengguna dan Password harus diisi")).toBeInTheDocument();
  });

  it("⚠️ NPM kosong, Password valid", () => {
    renderForm();
    fillAndSubmit("", "passwordBenar", "captcha");

    expect(screen.getByText("NPM tidak boleh kosong")).toBeInTheDocument();
    expect(screen.getByText("Akun Pengguna dan Password harus diisi")).toBeInTheDocument();
  });

  it("❌ NPM valid, Password salah", () => {
    renderForm();
    fillAndSubmit("12345678", "salahPassword", "captcha");

    // Validasi tidak mendeteksi isi salah karena tidak ada validasi autentikasi real
    expect(screen.queryByText(/tidak boleh kosong/i)).not.toBeInTheDocument();
  });
});
