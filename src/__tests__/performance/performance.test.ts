import { describe, it, expect } from 'vitest';
import {
    ITranscriptCourse,
    IAvailableCourse,
    IMataKuliah,
    IKrsInfo,
    IApiTranscriptItem,
    IKhsCourse,
    IJadwalKuliah,
    IJadwalMingguan,
    ITagihan,
    MahasiswaProfile,
    IStudentBiodata,
} from '../../types/mahasiswa.types';

// ============================================================================
// HELPER: Fungsi pengukur waktu eksekusi (high-resolution timer)
// ============================================================================
function measureExecution<T>(fn: () => T): { result: T; durationMs: number } {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return { result, durationMs: parseFloat((end - start).toFixed(4)) };
}

async function measureAsyncExecution<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, durationMs: parseFloat((end - start).toFixed(4)) };
}

// ============================================================================
// HELPER: Generator data mock untuk simulasi volume besar
// ============================================================================
function generateMockTranscriptItems(count: number): IApiTranscriptItem[] {
    const grades = ['A', 'B+', 'B', 'C+', 'C', 'D', 'E'];
    return Array.from({ length: count }, (_, i) => ({
        id: `item-${i}`,
        kehadiran: '90',
        tugas: '85',
        uts: '78',
        uas: '82',
        nilai: '80',
        hurufMutu: grades[i % grades.length],
        angkaMutu: String((4.0 - (i % grades.length) * 0.5).toFixed(2)),
        nilaiAkhir: String(((4.0 - (i % grades.length) * 0.5) * 3).toFixed(2)),
        siakKelasKuliahId: `kelas-${i}`,
        'krsMahasiswa.semester': (i % 8) + 1,
        'kelasKuliah.mataKuliah.id': `mk-${i}`,
        'kelasKuliah.mataKuliah.nama': `Mata Kuliah ${i + 1}`,
        'kelasKuliah.mataKuliah.kode': `IF${String(100 + i).padStart(3, '0')}`,
        'kelasKuliah.mataKuliah.totalSks': (i % 3) + 2,
        'kelasKuliah.mataKuliah.nilai_min': 'C',
    }));
}

function generateMockAvailableCourses(count: number): IAvailableCourse[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `cls-${i}`,
        siakMataKuliahId: `mk-${i}`,
        nama: `Kelas ${String.fromCharCode(65 + (i % 4))}`,
        kapasitas: 40,
        sistemKuliah: 'Reguler',
        jumlahPeminat: Math.floor(Math.random() * 40),
        mataKuliah: {
            id: `mk-${i}`,
            siakTahunKurikulumId: 'tk-1',
            nama: `Mata Kuliah ${i + 1}`,
            kode: `IF${String(100 + i).padStart(3, '0')}`,
            semester: (i % 8) + 1,
            nilaiMin: 'C',
            totalSks: (i % 3) + 2,
        },
        jadwalKuliah: [{
            id: `jadwal-${i}`,
            hari: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][i % 5],
            jamMulai: '08:00',
            jamSelesai: '10:00',
            dosen: { id: `dosen-${i}`, nama: `Dr. Dosen ${i + 1}`, nidn: `001${i}` },
            ruangan: { id: `ruang-${i}`, nama: `R.${100 + i}` },
        }],
    }));
}

function generateMockJadwalMingguan(coursesPerDay: number): IJadwalMingguan {
    const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
    const jadwal: IJadwalMingguan = {};
    days.forEach(day => {
        jadwal[day] = Array.from({ length: coursesPerDay }, (_, i) => ({
            namaMataKuliah: `MK ${day} ${i + 1}`,
            kodeMataKuliah: `IF${day.substring(0, 2).toUpperCase()}${i}`,
            jamMulai: `${8 + i * 2}:00`,
            jamSelesai: `${10 + i * 2}:00`,
            kelas: `Kelas ${String.fromCharCode(65 + i)}`,
            ruangan: `R.${100 + i}`,
            dosen: `Dr. Dosen ${i + 1}`,
        }));
    });
    return jadwal;
}

function generateMockTagihan(count: number): ITagihan[] {
    return Array.from({ length: count }, (_, i) => ({
        kodeInvoice: `INV-2024-${String(i + 1).padStart(4, '0')}`,
        metodeBayar: i % 2 === 0 ? 'Transfer Bank' : null,
        namaPeriode: `Genap 2024/2025`,
        tanggalTenggat: '2025-03-15',
        tanggalBayar: i % 2 === 0 ? '2025-03-10' : null,
        kodeKomponen: `KMP-${i}`,
        namaTagihan: `Tagihan ${i + 1}`,
        nominalTagihan: 500000 + i * 100000,
        lunas: i % 2 === 0 ? 'lunas' : 'belum lunas',
    }));
}

// ============================================================================
// PERFORMANCE TEST SUITE
// ============================================================================

describe('Performance Testing - Waktu Respons Sistem SIAKAD', () => {

    // ========================================================================
    // PT-01: Parsing & transformasi data transkrip (100 mata kuliah)
    // ========================================================================
    it('PT-01: Parsing data transkrip akademik (100 mata kuliah)', () => {
        const TARGET_MS = 50; // Target: < 50ms
        const rawData = generateMockTranscriptItems(100);

        const { durationMs } = measureExecution(() => {
            const rincianKrsDto: ITranscriptCourse[] = rawData.map((item) => {
                const sks = item['kelasKuliah.mataKuliah.totalSks'] !== null
                    ? Number(item['kelasKuliah.mataKuliah.totalSks']) : 0;
                const semester = item['krsMahasiswa.semester'] !== null
                    ? Number(item['krsMahasiswa.semester']) : 0;
                const namaMataKuliah = item['kelasKuliah.mataKuliah.nama'] || '-';
                const kodeMataKuliah = item['kelasKuliah.mataKuliah.kode'] || '-';
                const hurufMutu = item.hurufMutu || '-';
                const angkaMutu = item.angkaMutu !== null ? parseFloat(item.angkaMutu) : 0;
                const jumlahAngkaMutu = item.nilaiAkhir !== null
                    ? parseFloat(item.nilaiAkhir) : (angkaMutu * sks);
                return { namaMataKuliah, kodeMataKuliah, sks, hurufMutu, angkaMutu, jumlahAngkaMutu, semester };
            });

            const gradedCourses = rincianKrsDto.filter(
                (c) => c.hurufMutu && c.hurufMutu !== '-' && c.hurufMutu !== ''
            );
            const totalSks = gradedCourses.reduce((sum, c) => sum + c.sks, 0);
            const totalBobot = gradedCourses.reduce((sum, c) => sum + c.jumlahAngkaMutu, 0);
            const ipk = totalSks > 0 ? totalBobot / totalSks : 0;

            return { rincianKrsDto, ipk, totalSks };
        });

        console.log(`  ⏱ PT-01 Parsing Transkrip (100 MK): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
    });

    // ========================================================================
    // PT-02: Filtering & pencarian mata kuliah KRS (200 kelas)
    // ========================================================================
    it('PT-02: Filtering dan pencarian mata kuliah KRS (200 kelas)', () => {
        const TARGET_MS = 50;
        const allCourses = generateMockAvailableCourses(200);
        const searchKeyword = 'Mata Kuliah 15';
        const savedMataKuliahIds = new Set(['mk-0', 'mk-1', 'mk-2', 'mk-5', 'mk-10']);

        const { result, durationMs } = measureExecution(() => {
            // Step 1: Filter yang sudah tersimpan
            const available = allCourses.filter(c => !savedMataKuliahIds.has(c.mataKuliah.id));
            // Step 2: Pencarian berdasarkan keyword
            const searched = available.filter(c =>
                c.mataKuliah.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                c.mataKuliah.kode.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            // Step 3: Hitung total SKS dari hasil pencarian
            const totalSks = searched.reduce((sum, c) => sum + c.mataKuliah.totalSks, 0);
            return { available: available.length, searched: searched.length, totalSks };
        });

        console.log(`  ⏱ PT-02 Filter & Search KRS (200 kelas): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
        expect(result.available).toBeLessThan(200); // Beberapa sudah difilter
    });

    // ========================================================================
    // PT-03: Kalkulasi IPK kumulatif dari data transkrip besar (500 MK)
    // ========================================================================
    it('PT-03: Kalkulasi IPK kumulatif (500 mata kuliah)', () => {
        const TARGET_MS = 50;
        const rawData = generateMockTranscriptItems(500);

        const { result, durationMs } = measureExecution(() => {
            const courses: ITranscriptCourse[] = rawData.map((item) => ({
                namaMataKuliah: item['kelasKuliah.mataKuliah.nama'] || '-',
                kodeMataKuliah: item['kelasKuliah.mataKuliah.kode'] || '-',
                sks: Number(item['kelasKuliah.mataKuliah.totalSks'] || 0),
                hurufMutu: item.hurufMutu || '-',
                angkaMutu: parseFloat(item.angkaMutu || '0'),
                jumlahAngkaMutu: parseFloat(item.nilaiAkhir || '0'),
                semester: item['krsMahasiswa.semester'],
            }));

            const graded = courses.filter(c => c.hurufMutu && c.hurufMutu !== '-');
            const totalSks = graded.reduce((s, c) => s + c.sks, 0);
            const totalBobot = graded.reduce((s, c) => s + c.jumlahAngkaMutu, 0);
            const ipk = totalSks > 0 ? totalBobot / totalSks : 0;

            // Grouping per semester
            const perSemester = graded.reduce((acc, c) => {
                if (!acc[c.semester]) acc[c.semester] = { sks: 0, bobot: 0 };
                acc[c.semester].sks += c.sks;
                acc[c.semester].bobot += c.jumlahAngkaMutu;
                return acc;
            }, {} as Record<number, { sks: number; bobot: number }>);

            return { ipk, totalSks, semesterCount: Object.keys(perSemester).length };
        });

        console.log(`  ⏱ PT-03 Kalkulasi IPK (500 MK): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
        expect(result.ipk).toBeGreaterThan(0);
    });

    // ========================================================================
    // PT-04: Render jadwal mingguan dari data JSON (5 hari × 8 jadwal)
    // ========================================================================
    it('PT-04: Transformasi jadwal mingguan (5 hari × 8 kelas per hari)', () => {
        const TARGET_MS = 50;
        const jadwalRaw = generateMockJadwalMingguan(8);

        const { result, durationMs } = measureExecution(() => {
            const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
            const processed = days.map(day => ({
                hari: day.charAt(0).toUpperCase() + day.slice(1),
                jadwal: (jadwalRaw[day] || []).map((j: IJadwalKuliah) => ({
                    ...j,
                    durasi: `${j.jamMulai} - ${j.jamSelesai}`,
                    display: `${j.namaMataKuliah} (${j.kelas}) - ${j.ruangan}`,
                })),
                totalJam: (jadwalRaw[day] || []).length,
            }));

            const totalKelasPerMinggu = processed.reduce((s, d) => s + d.totalJam, 0);
            return { processed, totalKelasPerMinggu };
        });

        console.log(`  ⏱ PT-04 Transformasi Jadwal (40 kelas): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
        expect(result.totalKelasPerMinggu).toBe(40);
    });

    // ========================================================================
    // PT-05: Validasi dan perhitungan tagihan keuangan (50 item)
    // ========================================================================
    it('PT-05: Perhitungan tagihan keuangan mahasiswa (50 item tagihan)', () => {
        const TARGET_MS = 50;
        const allTagihan = generateMockTagihan(50);

        const { result, durationMs } = measureExecution(() => {
            const lunas = allTagihan.filter(t => t.lunas === 'lunas');
            const belumLunas = allTagihan.filter(t => t.lunas === 'belum lunas');

            const totalTagihan = allTagihan.reduce((s, t) => s + t.nominalTagihan, 0);
            const totalLunas = lunas.reduce((s, t) => s + t.nominalTagihan, 0);
            const sisaTagihan = belumLunas.reduce((s, t) => s + t.nominalTagihan, 0);

            // Sorting by tanggal tenggat
            const sorted = [...belumLunas].sort(
                (a, b) => new Date(a.tanggalTenggat).getTime() - new Date(b.tanggalTenggat).getTime()
            );

            return { totalTagihan, totalLunas, sisaTagihan, itemLunas: lunas.length, itemBelumLunas: belumLunas.length };
        });

        console.log(`  ⏱ PT-05 Kalkulasi Tagihan (50 item): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
        expect(result.totalTagihan).toBe(result.totalLunas + result.sisaTagihan);
    });

    // ========================================================================
    // PT-06: Select all & toggle checkbox pada daftar KRS besar (100 kelas)
    // ========================================================================
    it('PT-06: Toggle select all pada daftar KRS (100 kelas)', () => {
        const TARGET_MS = 50;
        const allCourses = generateMockAvailableCourses(100);
        const savedIds = new Set(['mk-0', 'mk-5', 'mk-10', 'mk-20', 'mk-50']);

        const { result, durationMs } = measureExecution(() => {
            // Filter available
            const available = allCourses.filter(c => !savedIds.has(c.mataKuliah.id));

            // Select all
            let selectedIds = available.map(c => c.id);
            const isAllSelected = selectedIds.length === available.length;

            // Deselect all (toggle)
            selectedIds = [];
            const isNoneSelected = selectedIds.length === 0;

            // Select specific with toggle
            selectedIds = ['cls-1', 'cls-3', 'cls-7'];
            const toggleId = 'cls-3';
            selectedIds = selectedIds.includes(toggleId)
                ? selectedIds.filter(id => id !== toggleId)
                : [...selectedIds, toggleId];

            return { available: available.length, isAllSelected, isNoneSelected, finalSelected: selectedIds.length };
        });

        console.log(`  ⏱ PT-06 Toggle Select KRS (100 kelas): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
        expect(result.isAllSelected).toBe(true);
    });

    // ========================================================================
    // PT-07: Validasi status KRS dan penentuan UI state
    // ========================================================================
    it('PT-07: Validasi status KRS dan routing UI (1000 iterasi)', () => {
        const TARGET_MS = 50;
        const statuses: IKrsInfo['statusKrs'][] = [
            'Belum Diajukan', 'Disetujui', 'Ditolak', 'Menunggu Persetujuan', 'Draft'
        ];

        const { result, durationMs } = measureExecution(() => {
            let validatedCount = 0;
            let notValidatedCount = 0;

            // Simulasi 1000 pengecekan status (stress test logika kondisional)
            for (let i = 0; i < 1000; i++) {
                const status = statuses[i % statuses.length];
                const krsValidated = status === 'Disetujui' || status === 'Diajukan';
                const canEdit = status === 'Draft' || status === 'Belum Diajukan';
                const canSubmit = status === 'Draft' || status === 'Belum Diajukan';
                const showApproved = status === 'Disetujui';

                if (krsValidated) validatedCount++;
                else notValidatedCount++;
            }

            return { validatedCount, notValidatedCount };
        });

        console.log(`  ⏱ PT-07 Validasi Status KRS (1000x): ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
        expect(result.validatedCount + result.notValidatedCount).toBe(1000);
    });

    // ========================================================================
    // PT-08: Rendering data profil mahasiswa (transformasi data besar)
    // ========================================================================
    it('PT-08: Transformasi data profil mahasiswa lengkap', () => {
        const TARGET_MS = 50;

        const mockProfile: MahasiswaProfile = {
            id: 'mhs-001', namaProgramStudi: 'Teknik Informatika', nama: 'Zikri Hamdi',
            npm: '2110010001', periodeMasuk: '2021/2022 Ganjil', kurikulum: '2021',
            sistemKuliah: 'Reguler', kelas: 'A', jenisPendaftaran: 'Baru',
            jalurPendaftaran: 'SNMPTN', gelombang: '1', jenisKelamin: 'Laki-laki',
            tempatLahir: 'Padang', tanggalLahir: '2003-01-15', noKk: '1371001234567890',
            nik: '1371001234567891', angkatan: '2021', tanggalMasuk: '2021-08-15',
            kebutuhanKhusus: false, statusMahasiswa: 'Aktif', alamatKtp: 'Jl. Sudirman No. 1',
            rtKtp: 1, rwKtp: 2, semester: 8, desaKtp: 'Padang Barat',
            provinsiKtp: 'Sumatera Barat', kodePosKtp: '25000', statusTinggalKtp: 'Bersama Orang Tua',
            alamatDomisili: 'Jl. Sudirman No. 1', rtDomisili: 1, rwDomisili: 2,
            desaDomisili: 'Padang Barat', provinsiDomisili: 'Sumatera Barat',
            kodePosDomisili: '25000', statusTinggalDomisili: 'Bersama Orang Tua',
            noTelepon: '0751123456', noHp: '08123456789', emailPribadi: 'zikri@gmail.com',
            emailKampus: 'zikri@univ.ac.id', noTerdaftar: '001', pendidikanAsal: 'SMA',
            provinsiSekolah: 'Sumatera Barat', kotaKabSekolah: 'Padang',
            namaPendidikanAsal: 'SMA Negeri 1 Padang', alamatSekolah: 'Jl. Pemuda No. 1',
            teleponSekolah: '0751654321', noIjazahSekolah: 'DN-01/12345',
            jenjang: 'S1', agama: 'Islam', beratBadan: 70, tinggiBadan: 175,
            golonganDarah: 'O', nisn: '0012345678', sks: 120, ipk: 3.65,
            keluargaMahasiswaList: Array.from({ length: 5 }, (_, i) => ({
                id: `kel-${i}`, hubungan: i === 0 ? 'Ayah' : i === 1 ? 'Ibu' : `Saudara ${i}`,
                nama: `Anggota Keluarga ${i + 1}`, nik: `13710012345678${i}0`,
                tanggalLahir: '1970-01-01', statusHidup: 'Hidup', statusKerabat: 'Kandung',
                pendidikan: 'S1', pekerjaan: 'PNS', penghasilan: '5000000',
                alamat: 'Jl. Sudirman No. 1', noTelepon: '08123456789', email: `kel${i}@mail.com`,
            })),
        };

        const { durationMs } = measureExecution(() => {
            // Transformasi untuk display di halaman profil
            const personalInfo = {
                namaLengkap: mockProfile.nama,
                npm: mockProfile.npm,
                prodi: mockProfile.namaProgramStudi,
                semester: `Semester ${mockProfile.semester}`,
                status: mockProfile.statusMahasiswa,
                ipk: mockProfile.ipk?.toFixed(2) || '-',
            };

            const addressInfo = {
                alamatKtp: `${mockProfile.alamatKtp}, RT ${mockProfile.rtKtp}/RW ${mockProfile.rwKtp}, ${mockProfile.desaKtp}, ${mockProfile.provinsiKtp} ${mockProfile.kodePosKtp}`,
                alamatDomisili: `${mockProfile.alamatDomisili}, RT ${mockProfile.rtDomisili}/RW ${mockProfile.rwDomisili}, ${mockProfile.desaDomisili}, ${mockProfile.provinsiDomisili} ${mockProfile.kodePosDomisili}`,
            };

            const familyData = mockProfile.keluargaMahasiswaList.map(k => ({
                ...k,
                displayName: `${k.hubungan}: ${k.nama}`,
            }));

            return { personalInfo, addressInfo, familyCount: familyData.length };
        });

        console.log(`  ⏱ PT-08 Transformasi Profil Mahasiswa: ${durationMs} ms (target: < ${TARGET_MS} ms)`);
        expect(durationMs).toBeLessThan(TARGET_MS);
    });
});
