import { useQuery } from '@tanstack/react-query';
import { financeService } from '../../api/mahasiswa/financeService';

// --- Tipe untuk filter ---
type HistoriFilters = {
    namaPeriode?: string;
    keyword?: string;
};

/**
 * Hook untuk mengambil data tagihan aktif.
 */
export const useTagihanAktif = () => {
    return useQuery({
        queryKey: ['tagihanAktif'],
        queryFn: () => financeService.getTagihanAktif().then((res) => res.data),
    });
};

/**
 * Hook untuk mengambil data histori tagihan.
 */
export const useHistoriTagihan = (filters: HistoriFilters) => {
    return useQuery({
        queryKey: ['historiTagihan', filters],
        queryFn: () => financeService.getHistoriTagihan(filters).then((res) => res.data),
    });
};

/**
 * Hook untuk mengambil data detail tagihan.
 */
export const useDetailTagihan = (invoiceId: string) => {
    return useQuery({
        queryKey: ['detailTagihan', invoiceId],
        queryFn: () => financeService.getDetailTagihan(invoiceId).then((res) => res.data),
        enabled: !!invoiceId,
    });
};