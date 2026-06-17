# Rencana Integrasi Modul OBE (Outcome-Based Education)

Modul OBE sudah memiliki fondasi di dalam aplikasi ini dan akan segera diimplementasikan berdasarkan *mockup* dan *endpoint* backend yang sudah tersedia. Dokumen ini bertujuan untuk menjelaskan letak dan cara kerja *existing code* terkait OBE sebagai referensi saat implementasi nanti.

## Status Saat Ini (Existing Code)

Berdasarkan `App.tsx` dan `src/types/VarRoutes.tsx`, beberapa rute manajemen OBE sudah tersedia untuk Admin Akademik:
- `/admin-akademik/obe/manajemen-obe` -> Komponen `OBEManagement`
- `/admin-akademik/obe/detail-obe` -> Komponen `DetailOBE`
- `/admin-akademik/obe/profil-lulusan` -> Komponen `GraduateProfile`
- `/admin-akademik/obe/cpl` -> Komponen `ObeCpl`
- `/admin-akademik/obe/cpmk` -> Komponen `ObeCpmk`
- `/admin-akademik/obe/cpmk-mata-kuliah` -> Komponen `ObeCpmkMatkul`

## Komponen Utama: `OBEManagement.tsx`

Halaman utama modul ini adalah `src/pages/admin-academic/academic/OBEManagement.tsx`. Halaman ini menampilkan tabel data kurikulum berdasarkan Program Studi dan Tahun Kurikulum. 

* **State dan Filter**: Terdapat filter pencarian untuk Tahun Kurikulum, Program Studi, dan Jenjang.
* **Hooks yang Digunakan**: 
  - `getObe()` (dari `src/hooks/academic/useObeManagement.ts`)
  - `getCurriculumYear()`
  - `getProdi()`
* **UI Komponen**: Menggunakan `<MainLayout>` dan tabel `<TableOBE>`.

## Tahapan Implementasi Mendatang

Karena fungsionalitas Backend (API endpoint) dan UI *Mockup* sudah siap, berikut adalah langkah yang harus dilakukan pada tahapan implementasi:

1. **Review Endpoint API OBE**:
   - Buka `src/hooks/academic/useObeManagement.ts` (beserta hooks terkait seperti `useGraduateProfile.ts`) dan pastikan path endpoint-nya sesuai dengan yang diberikan oleh tim Backend.
   - Periksa HTTP Method (`GET`, `POST`, `PUT`, `DELETE`) dan payload (struktur request body).

2. **Implementasi UI dari Mockup**:
   - Jika *mockup* memerlukan perubahan tampilan tabel OBE (`<TableOBE>`), modifikasi di direktori `src/components/Table.tsx`.
   - Modifikasi halaman detil (`ObeCpl`, `ObeCpmk`, `GraduateProfile`) agar sesuai dengan struktur fungsional *mockup* terbaru (seperti integrasi input form).

3. **Sinkronisasi Tipe Data (Types)**:
   - Sesuaikan *interface* atau *type* di `src/types/` untuk memastikan bahwa properti balikan dari endpoint OBE dikenali dengan baik oleh TypeScript.

4. **Integrasi Mutasi Data**:
   - Gunakan `useMutation` dari `@tanstack/react-query` untuk menangani aksi *Create*, *Update*, dan *Delete* pada data CPL, CPMK, Profil Lulusan, dll.
   - Tambahkan indikator *loading* (contoh: `<LoadingSpinner />`) dan notifikasi keberhasilan menggunakan `react-toastify` atau `sweetalert2` yang telah ter-install di dalam proyek.
