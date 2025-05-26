import { render, screen } from '@testing-library/react';
import { describe, expect, it} from 'vitest';
import { MemoryRouter as Router } from 'react-router-dom';

import DashboardAdminFinance from '../../pages/admin-finance/DashboardAdminFinance.tsx';

describe('DashboardAdminFinance', () => {
    it('renders without crashing', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        expect(screen.getByText("Data Tagihan 30 Hari Terakhir")).toBeInTheDocument();
    })

    it('data tagihan terbaru', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        const dataTerbaru = screen.getByTestId("data-terbaru-1")
        expect(dataTerbaru).toBeInTheDocument();
    })

    it('should render data transaksi terbaru', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        const dataTerbaru = screen.getByTestId("latest-trans-1")
        expect(dataTerbaru).toBeInTheDocument();
    });

    it('should render chart', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        const chartText = screen.getByText("Tagihan Per Fakultas")
        const chart = screen.getByTestId("chart-test")

        expect(chartText).toBeInTheDocument();
        expect(chart).toBeInTheDocument();
    });

    it('should render total tagihan', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        const tagihanInt = screen.getByTestId("total-tagihan")
        expect(tagihanInt).toBeInTheDocument()
    });

    it('should render total tagihan terbayar', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        const tagihanInt = screen.getByTestId("total-tagihan-sudah-bayar")
        expect(tagihanInt).toBeInTheDocument()
    });

    it('should render total tagihan belum terbayar', () => {
        render(
            <Router>
                <DashboardAdminFinance />
            </Router>
        )

        const tagihanInt = screen.getByTestId("total-tagihan-belum-bayar")
        expect(tagihanInt).toBeInTheDocument()
    });
})