// src/hooks/mahasiswa/useStudentRetakeData.ts
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react'; // Import useMemo
import { studentAcademicService } from '../../api/mahasiswa/studentAcademicService';
import { IFlattenedRetakeCourse } from '../../types/mahasiswa.types'; // Import the UI-facing type

export const useStudentRetakeData = () => {
    // Query for fetching student biodata (this remains the same)
    const {
        data: biodata,
        isLoading: isBiodataLoading,
        isError: isBiodataError,
        error: biodataError,
    } = useQuery({
        queryKey: ['studentBiodata'],
        queryFn: studentAcademicService.getStudentBiodata,
    });

    // Query for fetching the NESTED retake course data from the API
    const {
        data: apiRetakeCourses, // Renamed to clarify it's the raw API data
        isLoading: areCoursesLoading,
        isError: areCoursesError,
        error: coursesError,
    } = useQuery({
        queryKey: ['studentApiRetakeCourses'], // Updated key
        queryFn: studentAcademicService.getRetakeCourses,
    });

    // Transform the nested API data into a flat array for the UI table
    const flattenedRetakeCourses = useMemo((): IFlattenedRetakeCourse[] => {
        if (!apiRetakeCourses) {
            return [];
        }

        let flatList: IFlattenedRetakeCourse[] = [];
        let counter = 1;

        apiRetakeCourses.forEach(course => {
            course.periode.forEach((period, periodIndex) => {
                flatList.push({
                    // Create a unique ID for React's key prop
                    id: `${course.kodeMataKuliah}-${periodIndex}`,
                    no: counter++,
                    kodeMk: course.kodeMataKuliah,
                    namaMataKuliah: course.namaMataKuliah,
                    priode: period.periodeAkademik,
                    sks: period.sks,
                    semester: String(period.semester), // Ensure semester is a string for the table
                    nilai: period.nilai,
                });
            });
        });

        return flatList;
    }, [apiRetakeCourses]); // This memoization runs only when apiRetakeCourses changes

    const isLoading = isBiodataLoading || areCoursesLoading;
    const isError = isBiodataError || areCoursesError;
    const error = biodataError || coursesError;

    return {
        biodata,
        // Provide the transformed, flattened data to the component
        retakeCourses: flattenedRetakeCourses,
        isLoading,
        isError,
        error,
    };
};