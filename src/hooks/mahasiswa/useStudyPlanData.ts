import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentKrsService } from '../../api/mahasiswa/studentKrsService';
import { IAddKrsPayload, IApiKrsHistoryResponse } from '../../types/mahasiswa.types';
import { IAcademicPeriod } from '../../types/common.types';

// A utility hook for debouncing input to prevent excessive API calls
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


export const useStudyPlanData = () => {
    // Initialize queryClient to manage cache invalidation
    const queryClient = useQueryClient();

    // State for UI interactions like pagination and search
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');

    // Apply a 500ms debounce to the search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // 1. Query for fetching header info (status, SKS limit, etc.)
    const { data: krsInfo, isLoading: isLoadingInfo } = useQuery({
        queryKey: ['krsInfo'],
        queryFn: studentKrsService.getKrsInfo,
    });

    // 2. Query for fetching the list of available courses
    const {
        data: availableCoursesData,
        isLoading: isLoadingCourses,
        isError,
        error,
    } = useQuery({
        queryKey: ['availableCourses', debouncedSearchTerm, page, pageSize],
        queryFn: () => studentKrsService.getAvailableCourses({
            keyword: debouncedSearchTerm,
            page: page,
            size: pageSize,
        }),
        keepPreviousData: true,
    });

    // 3. Query for fetching courses that are already saved/in draft
    const { data: savedKrsData, isLoading: isLoadingSaved } = useQuery({
        queryKey: ['savedKrs'],
        queryFn: studentKrsService.getSavedCourses,
    });

    // 4. Mutation for adding selected courses to the KRS
    const { mutate: addCourses, isLoading: isAddingCourses } = useMutation({
        mutationFn: (payload: IAddKrsPayload) => studentKrsService.addCoursesToKrs(payload),
        onSuccess: (data) => {
            // When successfully saved, invalidate the 'savedKrs' query.
            // This tells React Query to automatically refetch the data
            // for the "KRS Tersimpan" tab, keeping the UI up-to-date.
            alert(data.message || "KRS berhasil disimpan!"); // Or use a toast notification
            queryClient.invalidateQueries({ queryKey: ['savedKrs'] });
        },
        onError: (error) => {
            // Handle potential errors during the mutation
            console.error("Gagal menyimpan KRS:", error);
            alert("Gagal menyimpan KRS. Silakan coba lagi.");
        }
    });

    const { mutate: submitKrs, isLoading: isSubmittingKrs } = useMutation({
        mutationFn: studentKrsService.submitKrsForApproval,
        onSuccess: (data) => {
            alert(data.message || "KRS telah berhasil diajukan.");
            // PENTING: Invalidate 'krsInfo' untuk mengambil status terbaru.
            // Ini akan membuat UI berganti ke mode terkunci secara otomatis.
            queryClient.invalidateQueries({ queryKey: ['krsInfo'] });
        },
        onError: (error) => {
            console.error("Gagal mengajukan KRS:", error);
            alert("Gagal mengajukan KRS. Silakan coba lagi.");
        },
    });

    // Return all data, states, and functions needed by the UI
    return {
        krsInfo,
        availableCoursesData,
        savedKrsData,
        isLoading: isLoadingInfo || isLoadingCourses || isLoadingSaved,
        isError,
        error,
        page,
        setPage,
        pageSize,
        setPageSize,
        searchTerm,
        setSearchTerm,
        addCourses,
        isAddingCourses,
        submitKrs,
        isSubmittingKrs,
    };
};