// src/hooks/mahasiswa/useStudentGradeData.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentAcademicService } from '../../api/mahasiswa/studentAcademicService';
import { IAcademicPeriod } from '../../types/common.types';

export const useStudentGradeData = () => {
    // State to hold the currently selected period name (e.g., "2024 Ganjil")
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');

    // 1. Fetch the list of all available academic periods for the dropdown
    const { data: periods, isLoading: isLoadingPeriods } = useQuery<IAcademicPeriod[]>({
        queryKey: ['availablePeriods'],
        queryFn: studentAcademicService.getAvailablePeriods,
    });

    // Automatically select the first period from the list once it's loaded
    useEffect(() => {
        if (periods && periods.length > 0 && !selectedPeriod) {
            setSelectedPeriod(periods[0].nama || periods[0].namaPeriode || '');
        }
    }, [periods, selectedPeriod]);

    // 2. Fetch the grades data based on the `selectedPeriod`
    // This query will automatically re-run whenever `selectedPeriod` changes.
    const {
        data: grades,
        isLoading: isLoadingGrades,
        isError,
        error
    } = useQuery({
        queryKey: ['studentGrades', selectedPeriod], // The key includes the period
        queryFn: () => studentAcademicService.getStudentGrades(selectedPeriod),
        // Only run this query if a period has been selected
        enabled: !!selectedPeriod,
    });

    return {
        periods: periods || [],
        grades: grades || [],
        selectedPeriod,
        setSelectedPeriod,
        isLoading: isLoadingPeriods || isLoadingGrades, // Combined loading state
        isError,
        error,
    };
};