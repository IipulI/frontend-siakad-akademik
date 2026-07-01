// src/hooks/mahasiswa/useKrsHistoryData.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentAcademicService } from '../../api/mahasiswa/studentAcademicService';
import { IAcademicPeriod, IApiKrsHistoryResponse } from '../../types/mahasiswa.types';

export const useKrsHistoryData = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');

    // 1. Ambil daftar periode yang tersedia (reusing logic)
    const { data: periods, isLoading: isLoadingPeriods } = useQuery<IAcademicPeriod[]>({
        queryKey: ['availablePeriods'],
        queryFn: studentAcademicService.getAvailablePeriods,
    });

    // Otomatis pilih periode pertama saat daftar sudah termuat
    useEffect(() => {
        if (periods && periods.length > 0 && !selectedPeriod) {
            setSelectedPeriod(periods[0].nama || periods[0].namaPeriode || '');
        }
    }, [periods, selectedPeriod]);

    // 2. Ambil data riwayat KRS berdasarkan periode yang dipilih
    const {
        data: krsHistoryData,
        isLoading: isLoadingHistory,
        isError,
        error
    } = useQuery<IApiKrsHistoryResponse>({
        queryKey: ['krsHistory', selectedPeriod],
        queryFn: () => studentAcademicService.getKrsHistory(selectedPeriod),
        enabled: !!selectedPeriod,
    });

    return {
        periods: periods || [],
        krsHistoryData, // Mengembalikan seluruh objek: { krs, totalSks, batasSks }
        selectedPeriod,
        setSelectedPeriod,
        isLoading: isLoadingPeriods || isLoadingHistory,
        isError,
        error,
    };
};