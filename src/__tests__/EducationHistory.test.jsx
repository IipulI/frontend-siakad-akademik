import { render, screen } from '@testing-library/react';
import EducationHistory from '../pages/profile/EducationHistory';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('EducationHistory', () => {
  it('shows education history fields', () => {
    render(
      <BrowserRouter>
        <EducationHistory />
      </BrowserRouter>
    );

expect(screen.getAllByText(/Pendidikan Asal/i).length).toBeGreaterThan(0);
expect(screen.getAllByText(/Provinsi Sekolah/i).length).toBeGreaterThan(0);
  });
});
