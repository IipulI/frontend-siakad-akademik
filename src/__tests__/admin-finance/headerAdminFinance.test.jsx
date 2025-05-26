import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it} from 'vitest';
import { MemoryRouter as Router, useLocation } from 'react-router-dom';

import HeaderAdminAcademic from '@/components/Header/HeaderAdminFinance';

function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
}

describe('HeaderAdminFinance', () => {
    it("Pindah ke halaman dashboard", async () => {
        render(
            <Router initialEntries={['/admin-keuangan/tagihan-mahasiswa']}>
                <HeaderAdminAcademic />
                <LocationDisplay />
            </Router>
        )

        const linkDashboard = screen.getByTestId("1");
        expect(linkDashboard).toBeInTheDocument();

        await userEvent.click(linkDashboard);

        expect(screen.getByTestId('location-display')).toHaveTextContent('/admin-keuangan/dashboard');
    })

    it("Pindah ke halaman buat tagihan", async () => {
        render(
            <Router initialEntries={['/admin-keuangan/dashboard']}>
                <HeaderAdminAcademic />
                <LocationDisplay />
            </Router>
        )

        const linkDashboard = screen.getByTestId("2");
        expect(linkDashboard).toBeInTheDocument();

        await userEvent.click(linkDashboard);

        expect(screen.getByTestId('location-display')).toHaveTextContent('/admin-keuangan/buat-tagihan');
    })

    it("Pindah ke halaman tagihan mahasiswa", async () => {
        render(
            <Router initialEntries={['/admin-keuangan/dashboard']}>
                <HeaderAdminAcademic />
                <LocationDisplay />
            </Router>
        )

        const linkDashboard = screen.getByTestId("3");
        expect(linkDashboard).toBeInTheDocument();

        await userEvent.click(linkDashboard);

        expect(screen.getByTestId('location-display')).toHaveTextContent('/admin-keuangan/tagihan-mahasiswa');
    })

    it("Pindah ke halaman kopmonen tagihan", async () => {
        render(
            <Router initialEntries={['/admin-keuangan/dashboard']}>
                <HeaderAdminAcademic />
                <LocationDisplay />
            </Router>
        )

        const linkDashboard = screen.getByTestId("4");
        expect(linkDashboard).toBeInTheDocument();

        await userEvent.click(linkDashboard);

        expect(screen.getByTestId('location-display')).toHaveTextContent('/admin-keuangan/komponen-tagihan');
    })
});