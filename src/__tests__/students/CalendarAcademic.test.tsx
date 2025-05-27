import { render, screen } from '@testing-library/react';
import CalendarAcademic from '../../pages/studentModule/schedule/CalendarAcademic';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import '@testing-library/jest-dom';

describe('CalendarAcademic', () => {
  it('renders calendar with current month', () => {
    render(
      <BrowserRouter>
        <CalendarAcademic />
      </BrowserRouter>
    );

    const currentMonth = format(new Date(), 'MMMM yyyy', { locale: id });
    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });

  it('can change month using left and right arrow buttons', async () => {
    render(
      <BrowserRouter>
        <CalendarAcademic />
      </BrowserRouter>
    );

    const currentMonth = format(new Date(), 'MMMM yyyy', { locale: id });
    const nextMonth = format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'MMMM yyyy', { locale: id });
    const prevMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MMMM yyyy', { locale: id });

    const rightBtn = screen.getByRole('button', { name: '>' });
    await userEvent.click(rightBtn);
    expect(screen.getByText(nextMonth)).toBeInTheDocument();

    const leftBtn = screen.getByRole('button', { name: '<' });
    await userEvent.click(leftBtn); // Kembali ke current
    await userEvent.click(leftBtn); // Mundur 1 bulan
    expect(screen.getByText(prevMonth)).toBeInTheDocument();
  });

  it('shows academic period dropdown', () => {
    render(
      <BrowserRouter>
        <CalendarAcademic />
      </BrowserRouter>
    );

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText(/2024 Genap/i)).toBeInTheDocument();
  });

  it('renders all day boxes and supports hover effect', async () => {
    render(
      <BrowserRouter>
        <CalendarAcademic />
      </BrowserRouter>
    );

    const allDayBoxes = screen.getAllByRole('generic').filter((el) =>
      el.className?.includes('cursor-pointer')
    );
    expect(allDayBoxes.length).toBeGreaterThan(0);

    // Hover hari pertama
    await userEvent.hover(allDayBoxes[0]);
    // Tidak ada perubahan visual yang langsung terdeteksi, tapi tidak error
  });
});
