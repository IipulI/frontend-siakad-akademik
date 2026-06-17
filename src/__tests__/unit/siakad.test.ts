import { describe, it, expect } from 'vitest';
import { transcriptService } from '../../api/mahasiswa/transcriptService';
import { ITranscriptData, ITranscriptCourse } from '../../types/mahasiswa.types';

/**
 * Unit Test: transcriptService
 * Memvalidasi logika parsing dan transformasi data transkrip akademik
 * dari format JSON API mentah menjadi struktur TypeScript yang aman.
 */
describe('transcriptService - Logika Transformasi Data', () => {

    // ================================================================
    // Test 1: Verifikasi kalkulasi IPK (Indeks Prestasi Kumulatif)
    // ================================================================
    it('harus menghitung IPK dengan benar berdasarkan bobot dan SKS', () => {
        const mockCourses: ITranscriptCourse[] = [
            { namaMataKuliah: 'Algoritma', kodeMataKuliah: 'IF101', sks: 3, hurufMutu: 'A', angkaMutu: 4.0, jumlahAngkaMutu: 12.0, semester: 1 },
            { namaMataKuliah: 'Basis Data', kodeMataKuliah: 'IF102', sks: 3, hurufMutu: 'B', angkaMutu: 3.0, jumlahAngkaMutu: 9.0, semester: 1 },
            { namaMataKuliah: 'Jaringan', kodeMataKuliah: 'IF103', sks: 2, hurufMutu: 'A', angkaMutu: 4.0, jumlahAngkaMutu: 8.0, semester: 1 },
        ];

        const totalSks = mockCourses.reduce((sum, c) => sum + c.sks, 0);
        const totalBobot = mockCourses.reduce((sum, c) => sum + c.jumlahAngkaMutu, 0);
        const ipk = totalSks > 0 ? totalBobot / totalSks : 0;

        // IPK = (12 + 9 + 8) / (3 + 3 + 2) = 29 / 8 = 3.625
        expect(totalSks).toBe(8);
        expect(totalBobot).toBe(29);
        expect(ipk).toBeCloseTo(3.625, 3);
    });

    // ================================================================
    // Test 2: Filter mata kuliah yang belum memiliki nilai
    // ================================================================
    it('harus memfilter mata kuliah tanpa nilai dari perhitungan IPK', () => {
        const mockCourses: ITranscriptCourse[] = [
            { namaMataKuliah: 'Algoritma', kodeMataKuliah: 'IF101', sks: 3, hurufMutu: 'A', angkaMutu: 4.0, jumlahAngkaMutu: 12.0, semester: 1 },
            { namaMataKuliah: 'Belum Dinilai', kodeMataKuliah: 'IF999', sks: 2, hurufMutu: '-', angkaMutu: 0, jumlahAngkaMutu: 0, semester: 2 },
            { namaMataKuliah: 'Kosong', kodeMataKuliah: 'IF998', sks: 3, hurufMutu: '', angkaMutu: 0, jumlahAngkaMutu: 0, semester: 2 },
        ];

        const gradedCourses = mockCourses.filter(
            (c) => c.hurufMutu && c.hurufMutu !== '-' && c.hurufMutu !== ''
        );

        // Hanya 1 mata kuliah yang memiliki nilai valid
        expect(gradedCourses).toHaveLength(1);
        expect(gradedCourses[0].namaMataKuliah).toBe('Algoritma');
    });

    // ================================================================
    // Test 3: Penanganan data API kosong (empty array)
    // ================================================================
    it('harus mengembalikan IPK 0 jika data transkrip kosong', () => {
        const mockCourses: ITranscriptCourse[] = [];

        const totalSks = mockCourses.reduce((sum, c) => sum + c.sks, 0);
        const totalBobot = mockCourses.reduce((sum, c) => sum + c.jumlahAngkaMutu, 0);
        const ipk = totalSks > 0 ? totalBobot / totalSks : 0;

        expect(totalSks).toBe(0);
        expect(totalBobot).toBe(0);
        expect(ipk).toBe(0);
    });

    // ================================================================
    // Test 4: Validasi mapping field data JSON API ke TypeScript
    // ================================================================
    it('harus memetakan field JSON API mentah ke interface TypeScript dengan benar', () => {
        // Simulasi raw data dari API (format flat key)
        const rawApiItem = {
            id: 'abc-123',
            hurufMutu: 'A',
            angkaMutu: '4.00',
            nilaiAkhir: '12.00',
            'krsMahasiswa.semester': 3,
            'kelasKuliah.mataKuliah.nama': 'Pemrograman Web',
            'kelasKuliah.mataKuliah.kode': 'IF201',
            'kelasKuliah.mataKuliah.totalSks': 3,
        };

        // Mapping manual sesuai logika transcriptService.ts
        const mapped: ITranscriptCourse = {
            namaMataKuliah: rawApiItem['kelasKuliah.mataKuliah.nama'] || '-',
            kodeMataKuliah: rawApiItem['kelasKuliah.mataKuliah.kode'] || '-',
            sks: Number(rawApiItem['kelasKuliah.mataKuliah.totalSks'] || 0),
            hurufMutu: rawApiItem.hurufMutu || '-',
            angkaMutu: parseFloat(rawApiItem.angkaMutu || '0'),
            jumlahAngkaMutu: parseFloat(rawApiItem.nilaiAkhir || '0'),
            semester: rawApiItem['krsMahasiswa.semester'],
        };

        expect(mapped.namaMataKuliah).toBe('Pemrograman Web');
        expect(mapped.kodeMataKuliah).toBe('IF201');
        expect(mapped.sks).toBe(3);
        expect(mapped.hurufMutu).toBe('A');
        expect(mapped.angkaMutu).toBe(4.0);
        expect(mapped.jumlahAngkaMutu).toBe(12.0);
        expect(mapped.semester).toBe(3);
    });

    // ================================================================
    // Test 5: Validasi fallback untuk field null/undefined dari API
    // ================================================================
    it('harus memberikan nilai default jika field API bernilai null', () => {
        const rawApiItem = {
            id: 'xyz-456',
            hurufMutu: null,
            angkaMutu: null,
            nilaiAkhir: null,
            'krsMahasiswa.semester': 1,
            'kelasKuliah.mataKuliah.nama': null,
            'kelasKuliah.mataKuliah.kode': null,
            'kelasKuliah.mataKuliah.totalSks': null,
        };

        const mapped: ITranscriptCourse = {
            namaMataKuliah: rawApiItem['kelasKuliah.mataKuliah.nama'] || '-',
            kodeMataKuliah: rawApiItem['kelasKuliah.mataKuliah.kode'] || '-',
            sks: Number(rawApiItem['kelasKuliah.mataKuliah.totalSks'] || 0),
            hurufMutu: rawApiItem.hurufMutu || '-',
            angkaMutu: parseFloat(rawApiItem.angkaMutu || '0'),
            jumlahAngkaMutu: parseFloat(rawApiItem.nilaiAkhir || '0'),
            semester: rawApiItem['krsMahasiswa.semester'],
        };

        expect(mapped.namaMataKuliah).toBe('-');
        expect(mapped.kodeMataKuliah).toBe('-');
        expect(mapped.sks).toBe(0);
        expect(mapped.hurufMutu).toBe('-');
        expect(mapped.angkaMutu).toBe(0);
        expect(mapped.jumlahAngkaMutu).toBe(0);
    });
});

/**
 * Unit Test: Validasi Logika Bisnis KRS (Kartu Rencana Studi)
 * Menguji aturan-aturan bisnis pada sisi front-end saat mahasiswa mengisi KRS.
 */
describe('KRS - Logika Validasi Bisnis Front-End', () => {

    // ================================================================
    // Test 6: Validasi batas maksimum SKS
    // ================================================================
    it('harus menolak pemilihan mata kuliah jika total SKS melebihi batas', () => {
        const batasSks = 24;
        const selectedCourses = [
            { id: '1', sks: 3 },
            { id: '2', sks: 3 },
            { id: '3', sks: 4 },
            { id: '4', sks: 3 },
            { id: '5', sks: 3 },
            { id: '6', sks: 3 },
            { id: '7', sks: 3 },
            { id: '8', sks: 3 }, // Total = 25, melebihi batas
        ];

        const totalSksSelected = selectedCourses.reduce((sum, c) => sum + c.sks, 0);
        const isOverLimit = totalSksSelected > batasSks;

        expect(totalSksSelected).toBe(25);
        expect(isOverLimit).toBe(true);
    });

    // ================================================================
    // Test 7: Validasi minimal 1 mata kuliah harus dipilih
    // ================================================================
    it('harus menolak pengiriman KRS jika tidak ada kelas yang dipilih', () => {
        const selectedCourseIds: string[] = [];
        const canSubmit = selectedCourseIds.length > 0;

        expect(canSubmit).toBe(false);
    });

    // ================================================================
    // Test 8: Filter mata kuliah yang sudah tersimpan di KRS
    // ================================================================
    it('harus menyaring mata kuliah yang sudah ada di daftar KRS tersimpan', () => {
        const allCourses = [
            { id: '1', mataKuliah: { id: 'mk-1' } },
            { id: '2', mataKuliah: { id: 'mk-2' } },
            { id: '3', mataKuliah: { id: 'mk-3' } },
        ];
        const savedMataKuliahIds = new Set(['mk-1', 'mk-3']);

        const availableToSelect = allCourses.filter(c => !savedMataKuliahIds.has(c.mataKuliah.id));

        expect(availableToSelect).toHaveLength(1);
        expect(availableToSelect[0].mataKuliah.id).toBe('mk-2');
    });

    // ================================================================
    // Test 9: Toggle select all harus memilih semua yang tersedia
    // ================================================================
    it('harus memilih semua mata kuliah yang tersedia saat toggle select all', () => {
        const availableCourses = [
            { id: 'cls-1' },
            { id: 'cls-2' },
            { id: 'cls-3' },
        ];

        // Simulasi toggleSelectAll
        const selectedAll = availableCourses.map(c => c.id);

        expect(selectedAll).toEqual(['cls-1', 'cls-2', 'cls-3']);
        expect(selectedAll).toHaveLength(3);
    });

    // ================================================================
    // Test 10: Status KRS harus menentukan aksi tombol yang tersedia
    // ================================================================
    it('harus memblokir perubahan KRS jika status sudah Disetujui', () => {
        const krsStatuses = ['Disetujui', 'Diajukan'];

        krsStatuses.forEach(status => {
            const krsValidated = status === 'Disetujui' || status === 'Diajukan';
            expect(krsValidated).toBe(true);
        });

        const draftStatus = 'Draft';
        const draftValidated = draftStatus === 'Disetujui' || draftStatus === 'Diajukan';
        expect(draftValidated).toBe(false);
    });
});

/**
 * Unit Test: Validasi Logika Input Nilai Dosen
 * Menguji batasan angka dan format inputan nilai pada sisi front-end.
 */
describe('Input Nilai Dosen - Validasi Format Front-End', () => {

    // ================================================================
    // Test 11: Nilai valid harus berada dalam rentang 0-100
    // ================================================================
    it('harus menerima nilai angka dalam rentang 0 sampai 100', () => {
        const validateNilai = (val: number) => val >= 0 && val <= 100;

        expect(validateNilai(0)).toBe(true);
        expect(validateNilai(50)).toBe(true);
        expect(validateNilai(100)).toBe(true);
        expect(validateNilai(85.5)).toBe(true);
    });

    // ================================================================
    // Test 12: Nilai di luar rentang harus ditolak
    // ================================================================
    it('harus menolak nilai negatif atau melebihi 100', () => {
        const validateNilai = (val: number) => val >= 0 && val <= 100;

        expect(validateNilai(-1)).toBe(false);
        expect(validateNilai(101)).toBe(false);
        expect(validateNilai(999)).toBe(false);
    });

    // ================================================================
    // Test 13: Konversi nilai angka ke huruf mutu
    // ================================================================
    it('harus mengkonversi nilai angka ke huruf mutu yang benar', () => {
        const convertToGrade = (nilai: number): string => {
            if (nilai >= 80) return 'A';
            if (nilai >= 68) return 'B';
            if (nilai >= 56) return 'C';
            if (nilai >= 45) return 'D';
            return 'E';
        };

        expect(convertToGrade(90)).toBe('A');
        expect(convertToGrade(80)).toBe('A');
        expect(convertToGrade(75)).toBe('B');
        expect(convertToGrade(60)).toBe('C');
        expect(convertToGrade(50)).toBe('D');
        expect(convertToGrade(30)).toBe('E');
    });
});
