// src/components/mahasiswa/StudentGradeTable.tsx (Lokasi yang disarankan)
import React from 'react';
import { IStudentGradeCourse } from '../../types/mahasiswa.types';

interface StudentGradeTableProps {
    data: IStudentGradeCourse[];
}

const StudentGradeTable = ({ data }: StudentGradeTableProps) => {
    const isDataAvailable = data && data.length > 0;

    return (
        <div className="overflow-x-auto p-4">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-primary-green border border-black/50 text-white">
                <tr>
                    <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">Kurikulum</th>
                    <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">Kode MK</th>
                    <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">Nama Mata Kuliah</th>
                    <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">Nama Kelas</th>
                    <th colSpan={3} className="border border-gray-300 font-semibold px-4 py-2">Komponen Nilai</th>
                    <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">Nilai Akhir</th>
                </tr>
                <tr>
                    <th className="border border-gray-300 font-semibold px-4 py-2">Komponen</th>
                    <th className="border border-gray-300 font-semibold px-4 py-2">%</th>
                    <th className="border border-gray-300 font-semibold px-4 py-2">Nilai</th>
                </tr>
                </thead>
                <tbody>
                {isDataAvailable ? (
                    data.map((course) => {
                        const components = course.komposisiNilaiMataKuliahResDto;
                        const rowSpan = components.length > 0 ? components.length : 1; // Mencegah rowSpan 0

                        return (
                            <React.Fragment key={course.kodeMataKuliah}>
                                <tr>
                                    <td rowSpan={rowSpan} className="border border-gray-300 font-semibold px-4 py-2 align-top text-center">{course.tahunKurikulum}</td>
                                    <td rowSpan={rowSpan} className="border border-gray-300 font-semibold px-4 py-2 align-top text-center">{course.kodeMataKuliah}</td>
                                    <td rowSpan={rowSpan} className="border border-gray-300 font-semibold px-4 py-2 align-top text-left">{course.namaMataKuliah}</td>
                                    <td rowSpan={rowSpan} className="border border-gray-300 font-semibold px-4 py-2 align-top text-center">{course.namaKelas}</td>

                                    {/* Grade components for the first row */}
                                    <td className="border border-gray-300 font-semibold px-4 py-2 text-left">{components[0]?.namaKomposisi || ''}</td>
                                    <td className="border border-gray-300 font-semibold px-4 py-2 text-center">{components[0]?.persentase || ''}</td>
                                    <td className="border border-gray-300 font-semibold px-4 py-2 text-center">{components[0]?.nilai || ''}</td>

                                    <td rowSpan={rowSpan} className="border border-gray-300 font-semibold px-4 py-2 align-top text-center">{course.nilai ?? 'N/A'}</td>
                                </tr>

                                {/* Render subsequent rows for the rest of the grade components */}
                                {components.slice(1).map((comp, index) => (
                                    <tr key={`${course.kodeMataKuliah}-${comp.namaKomposisi}-${index}`}>
                                        <td className="border border-gray-300 font-semibold px-4 py-2 text-left">{comp.namaKomposisi}</td>
                                        <td className="border border-gray-300 font-semibold px-4 py-2 text-center">{comp.persentase}</td>
                                        <td className="border border-gray-300 font-semibold px-4 py-2 text-center">{comp.nilai}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })
                ) : (
                    // --- INI ADALAH TAMPILAN JIKA DATA TIDAK ADA ---
                    <tr>
                        <td colSpan={8} className="text-center p-4 border border-gray-300">
                            Data nilai untuk periode ini tidak ditemukan.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentGradeTable;