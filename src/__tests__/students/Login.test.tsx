import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../../pages/LoginPage"; // Ganti jadi LoginPage, bukan FormLogin

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const queryClient = new QueryClient();

// Helper untuk render komponen
const renderForm = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </QueryClientProvider>
  );

describe("FormLogin Component", () => {
  it("should render email, password fields and login button", () => {
    renderForm();

    // Ganti getByLabelText menjadi getByPlaceholderText
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/kode/i)).toBeInTheDocument(); // Captcha
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should show validation error if fields are empty", () => {
    renderForm();

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    expect(screen.getByText(/akun pengguna dan password harus diisi/i)).toBeInTheDocument();
  });

  it("should change username, password, captcha input values", () => {
    renderForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const captchaInput = screen.getByPlaceholderText(/kode/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(captchaInput, { target: { value: "ABC123" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
    expect(captchaInput).toHaveValue("ABC123");
  });
});
