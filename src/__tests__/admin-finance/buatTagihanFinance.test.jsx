import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it} from 'vitest';
import {MemoryRouter as Router, useLocation} from 'react-router-dom';

import CreateBill from '../../pages/admin-finance/create-bill/CreateBill.js';

function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
}

describe('BuatTagihanFinance', () => {
    it('renders without crashing', () => {
        render (
            <Router>
                <CreateBill />
            </Router>
        )

        const firstData = screen.getByTestId("data-1")
        expect(firstData).toBeInTheDocument();
    })

    it('should change url page when click tambah', async () => {
        render(
            <Router initialEntries={['/admin-keuangan/buat-tagihan']}>
                <CreateBill />
                <LocationDisplay />
            </Router>
        )

        const linkDashboard = screen.getByText("Tambah").closest("button")
        expect(linkDashboard).toBeInTheDocument();

        await userEvent.click(linkDashboard);

        expect(screen.getByTestId('location-display')).toHaveTextContent('/admin-keuangan/buat-tagihan/form-buat-tagihan');
    });
})