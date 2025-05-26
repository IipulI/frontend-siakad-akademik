import {fireEvent, render, screen} from '@testing-library/react';
import { describe, expect, it} from 'vitest';
import { MemoryRouter as Router } from 'react-router-dom';

import FormCreateBill from '../../pages/admin-finance/create-bill/FormCreateBill.js';
import userEvent from "@testing-library/user-event";

describe('formBuatTagihanMahasiswaFinance', () => {
    it('renders without crashing', () => {
        render(
            <Router>
                <FormCreateBill />
            </Router>
        )

        const text = screen.getByTestId("data-1")
        expect(text).toBeInTheDocument();
    })

    it('adds an expense to selected list and updates total price', async () => {
        const user = userEvent.setup();
        render(
            <Router>
                <FormCreateBill />
            </Router>
        );

        // cek total harga adalah 2 juta
        const totalPrice = screen.getByTestId("total-price")
        expect(totalPrice).toBeInTheDocument();
        expect(totalPrice).toHaveTextContent("Rp2.000.000");

        // handle untuk simulasi klik button tambah
        const addButtonForUjian = screen.getByTestId('tambah-1'); // Ujian has id: 1
        await user.click(addButtonForUjian);

        // cek komponen ujian ada di elemen kanan
        const selectedItemsContainer = screen.getByText('Biaya yang Dipilih').closest('div').querySelector('.max-h-64');
        expect(selectedItemsContainer).toHaveTextContent('Ujian');
        expect(selectedItemsContainer).toHaveTextContent('Rp900.000');

        // cek komponen ujian tidak ada di elemen kiri
        const availableItemsContainer = screen.getByText('Biaya yang tersedia').closest('div').querySelector('.max-h-64');
        expect(availableItemsContainer).not.toHaveTextContent('Ujian');

        // cek total harga jadi 2.9 juta
        expect(totalPrice).toBeInTheDocument();
        expect(totalPrice).toHaveTextContent("Rp2.900.000");
    });

    it('removes an expense from selected list and updates total price', async () => {
        const user = userEvent.setup();
        render(
            <Router>
                <FormCreateBill />
            </Router>
        );

        // Initial total price (SPP = Rp2.000.000)
        const totalPrice = screen.getByTestId("total-price")
        expect(totalPrice).toBeInTheDocument();
        expect(totalPrice).toHaveTextContent("Rp2.000.000");

        const removeButtonForSPP = screen.getByTestId('hapus-3'); // SPP has id: 3
        await user.click(removeButtonForSPP);

        // Check if SPP is removed from selected list
        const selectedItemsContainer = screen.getByText('Biaya yang Dipilih').closest('div').querySelector('.max-h-64');
        expect(selectedItemsContainer).not.toHaveTextContent('SPP');
        expect(screen.getByText('No selected expenses')).toBeInTheDocument(); // Since SPP was the only one

        // Check if SPP is added back to available list
        const availableItemsContainer = screen.getByText('Biaya yang tersedia').closest('div').querySelector('.max-h-64');
        expect(availableItemsContainer).toHaveTextContent('SPP');
        expect(availableItemsContainer).toHaveTextContent('Rp2.000.000');

        // Check updated total price (Rp0)
        expect(totalPrice).toBeInTheDocument();
        expect(totalPrice).toHaveTextContent("Rp0");
    });


})