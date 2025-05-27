import { render, screen } from '@testing-library/react';
import StudentInformation from '../pages/profile/StudentInformation';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('StudentInformation', () => {
  it('shows Data Diri, Domisili, and Kontak tabs when clicked', async () => {
    render(
      <BrowserRouter>
        <StudentInformation />
      </BrowserRouter>
    );

    // Default aktif: Data Diri
    expect(screen.getByText(/NIM/i)).toBeInTheDocument();

    const domisiliBtn = screen.getByRole('button', { name: /Domisili/i });
    await userEvent.click(domisiliBtn);
    expect(screen.getAllByText(/KTP/i).length).toBeGreaterThan(0);

    const kontakBtn = screen.getByRole('button', { name: /Kontak/i });
    await userEvent.click(kontakBtn);
    expect(screen.getAllByText(/No.Telepon/i).length).toBeGreaterThan(0);
  });
});
