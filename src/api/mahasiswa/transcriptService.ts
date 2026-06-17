import { Api } from "../Index";
import { ITranscriptData, ITranscriptCourse, IApiTranscriptItem } from "../../types/mahasiswa.types";

export const transcriptService = {
    /**
     * Fetches the complete transcript data for the student from the new endpoint.
     */
    getTranscript: async (): Promise<ITranscriptData> => {
        const response = await Api.get("/mahasiswa/hasil-studi/transkrip");

        // Handle wrapping in standard api response (response.data.data) or raw array (response.data)
        const rawData: IApiTranscriptItem[] = Array.isArray(response.data)
            ? response.data
            : (response.data.data || []);

        const rincianKrsDto: ITranscriptCourse[] = rawData.map((item) => {
            const sks = item["kelasKuliah.mataKuliah.totalSks"] !== null && item["kelasKuliah.mataKuliah.totalSks"] !== undefined
                ? Number(item["kelasKuliah.mataKuliah.totalSks"])
                : (item.kelasKuliah?.mataKuliah?.totalSks ?? 0);

            const semester = item["krsMahasiswa.semester"] !== null && item["krsMahasiswa.semester"] !== undefined
                ? Number(item["krsMahasiswa.semester"])
                : (item.krsMahasiswa?.semester ?? 0);

            const namaMataKuliah = item["kelasKuliah.mataKuliah.nama"] || item.kelasKuliah?.mataKuliah?.nama || "-";
            const kodeMataKuliah = item["kelasKuliah.mataKuliah.kode"] || item.kelasKuliah?.mataKuliah?.kode || "-";

            const hurufMutu = item.hurufMutu || "-";
            const angkaMutu = item.angkaMutu !== null && item.angkaMutu !== undefined
                ? parseFloat(item.angkaMutu)
                : 0;
            const jumlahAngkaMutu = item.nilaiAkhir !== null && item.nilaiAkhir !== undefined
                ? parseFloat(item.nilaiAkhir)
                : (angkaMutu * sks);

            return {
                namaMataKuliah,
                kodeMataKuliah,
                sks,
                hurufMutu,
                angkaMutu,
                jumlahAngkaMutu,
                semester,
            };
        });

        // Filter out courses that have no grade yet for calculation of IPK and totalSks
        const gradedCourses = rincianKrsDto.filter(
            (c) => c.hurufMutu && c.hurufMutu !== "-" && c.hurufMutu !== ""
        );

        const totalSks = gradedCourses.reduce((sum, c) => sum + c.sks, 0);
        const totalBobot = gradedCourses.reduce((sum, c) => sum + c.jumlahAngkaMutu, 0);
        const ipk = totalSks > 0 ? totalBobot / totalSks : 0;

        return {
            rincianKrsDto,
            ipk,
            totalSks,
        };
    },
};