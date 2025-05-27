import { render, screen } from '@testing-library/react';
import ParentInformation from '../../pages/studentModule/profile/ParentInformation';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('ParentInformation', () => {
  it('shows Orang Tua and Wali sections when clicked', async () => {
    render(
      <BrowserRouter>
        <ParentInformation />
      </BrowserRouter>
    );

    // Default aktif: Orang Tua
    expect(screen.getByText(/Biodata Ayah/i)).toBeInTheDocument();

    const waliBtn = screen.getByRole('button', { name: /Wali/i });
    await userEvent.click(waliBtn);
    expect(screen.getByText(/Tanggal lahir/i)).toBeInTheDocument();
  });
});
