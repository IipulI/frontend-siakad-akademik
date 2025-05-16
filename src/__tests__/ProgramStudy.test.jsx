import { render, screen } from '@testing-library/react';
import ProgramStudy from '../pages/profile/ProgramStudy';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('ProgramStudy', () => {
  it('shows program study fields', () => {
    render(
      <BrowserRouter>
        <ProgramStudy />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Program Studi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Fakultas/i).length).toBeGreaterThan(0);
  });
});
