import React from "react";
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; 
import FormLogin from './FormLogin';
import { useNavigate } from 'react-router-dom'; 

beforeEach(() => {
  vi.resetAllMocks(); 
})

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate:vi.fn(),
       // Memastikan useNavigate dipanggil
  };
});

beforeEach(() => {
    vi.resetAllMocks(); // supaya tiap test mulai bersih
  });


  describe("FormLogin", () => {
    it("Login dengan username dan password valid", async () => {
      const navigate = vi.fn();  // Buat spy
      // Buat supaya useNavigate return spy ini
      require('react-router-dom').useNavigate.mockReturnValue(navigate);
  
      render(<FormLogin />);
  
      const usernameInput = screen.getByLabelText("Username");
      const passwordInput = screen.getByLabelText("Password");
      const loginButton = screen.getByRole('button', { name: /login/i });
  
      await userEvent.type(usernameInput, 'validUsername');
      await userEvent.type(passwordInput, 'validPassword');
      await userEvent.click(loginButton);
  
      expect(navigate).toHaveBeenCalledWith('/dashboard');
    });
  

    test('Username dan Password diisi tapi tidak valid', async () => {
        render(<FormLogin />);
      
        const npmInput = (await screen.getAllByPlaceholderText('NPM'))[0]; 
        const passwordInput = (await screen.getAllByPlaceholderText('Password'))[0]; // Ambil elemen pertama
        const captchaInput = (await screen.getAllByPlaceholderText('Masukan kode diatas'))[0]; // Ambil elemen pertama
        const loginButton = screen.getAllByRole('button', { name: 'Login' });
              
        await userEvent.type(npmInput, '2348953');
        await userEvent.type(passwordInput, 'secret');
        await userEvent.type(captchaInput, 'ABCD');
      
        await userEvent.click(loginButton); // <- ini harus userEvent + await
      
        expect(screen.getByText(/username atau password salah/i)).toBeInTheDocument();

        expect(mockNavigate).notHaveBeenCalledWith('/dashboard');
      
      
      });
    test('Username dan Password tidak ada', async()=>{

    });
});