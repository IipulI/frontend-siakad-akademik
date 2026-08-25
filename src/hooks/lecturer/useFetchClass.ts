// hooks/useLecturerClass.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useClassList = (keyword: string, periodeAkademikId: string, programStudi: string, sistemKuliah: string, page: number, size: number) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah',
      keyword,
      periodeAkademikId,
      programStudi,
      sistemKuliah,
      page,
      size
    ],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah`, {
        params: {
          search: keyword,
          siakPeriodeAkademikId: periodeAkademikId || undefined,
          siakProgramStudiId: programStudi || undefined,
          sistemKuliah: sistemKuliah || undefined,
          page,
          size
        }
      });

      const items = res.data.data || res.data.items || [];
      const pagination = res.data.pagination || {};

      const mappedData = items.map((row: any) => {
        const dosenList = Array.from(
          new Set(
            row.jadwalKuliah?.map((j: any) => j.dosen?.nama || j.dosen?.namaDosen).filter(Boolean)
          )
        );

        const schedules = row.jadwalKuliah?.map((j: any) => {
          const start = j.jamMulai ? j.jamMulai.slice(0, 5) : '';
          const end = j.jamSelesai ? j.jamSelesai.slice(0, 5) : '';
          return `${j.hari || ''} ${start}-${end}`;
        }) || [];

        return {
          id: row.id,
          nama: row.nama,
          kapasitas: row.kapasitas,
          peserta: row.jumlahPeminat ?? row.jumlah_peminat ?? 0,
          sistemKuliah: row.sistemKuliah || row.sistem_kuliah || 'Reguler',
          dosen: dosenList.length > 0 ? dosenList : ['-'],
          jadwalMingguan: schedules,
          mataKuliah: {
            id: row.mataKuliah?.id || '',
            kodeMataKuliah: row.mataKuliah?.kode || '',
            namaMataKuliah: row.mataKuliah?.nama || '',
            tahunKurikulum: row.mataKuliah?.tahunKurikulum || '-',
          },
          programStudi: {
            id: row.mataKuliah?.programStudi?.id || row.programStudi?.id || '',
            namaProgramStudi: row.mataKuliah?.programStudi?.nama || row.programStudi?.nama || '-',
          },
          kunci: row.statusPenilaian === 'Dikunci' || row.status_penilaian === 'Dikunci' || false,
        };
      });

      return {
        data: mappedData,
        pagination: {
          totalPages: pagination.totalPage || 1,
          totalItems: pagination.totalItems || 0
        }
      };
    },
  });

export const useClassDetail = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail', id],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah/${id}`);
      const raw = res.data.data || res.data;
      if (!raw) return null;
      return {
        id: raw.id,
        nama: raw.nama,
        kapasitas: raw.kapasitas,
        jumlahPeminat: raw.jumlahPeminat ?? raw.jumlah_peminat ?? 0,
        jumlahPertemuan: raw.jumlahPertemuan,
        tanggalMulai: raw.tanggalMulai,
        tanggalSelesai: raw.tanggalSelesai,
        sistemKuliah: raw.sistemKuliah || raw.sistem_kuliah,
        periodeAkademik: raw.periodeAkademik?.nama || raw.periodeAkademik,
        siakPeriodeAkademikId: raw.periodeAkademik?.id || raw.siakPeriodeAkademikId || '',
        programStudi: {
          id: raw.programStudi?.id || raw.mataKuliah?.programStudi?.id || '',
          namaProgramStudi: raw.programStudi?.nama || raw.mataKuliah?.programStudi?.nama || raw.programStudi?.namaProgramStudi || '-',
          jenjang: raw.programStudi?.jenjang || raw.mataKuliah?.programStudi?.jenjang || { jenjang: 'S1' }
        },
        mataKuliah: {
          id: raw.mataKuliah?.id || '',
          kodeMataKuliah: raw.mataKuliah?.kode || raw.mataKuliah?.kodeMataKuliah || '',
          namaMataKuliah: raw.mataKuliah?.nama || raw.mataKuliah?.namaMataKuliah || '',
          totalSks: raw.mataKuliah?.totalSks ?? 0,
          tahunKurikulum: raw.mataKuliah?.tahunKurikulum?.tahun || raw.mataKuliah?.tahunKurikulum?.keterangan || raw.mataKuliah?.tahunKurikulum || '-',
        },
        jadwalKuliah: raw.jadwalKuliah || [],
      };
    },
    enabled: !!id
  });

export const useClassParticipants = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail/peserta-kelas', id],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah/${id}/peserta-kelas`);
      return res.data.data || res.data;
    },
    enabled: !!id
  });

export const useClassSchedule = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail/jadwal-kelas', id],
    queryFn: async () => {
      const res = await Api.get(`/akademik/kelas-kuliah/${id}/schedule`);
      return res.data.data || res.data;
    },
    enabled: !!id
  });

export const useClassGrading = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail/grading', id],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah/${id}/grading`);
      return res.data.data || res.data;
    },
    enabled: !!id
  });

export const useSubmitGrading = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      siakMahasiswaId: string;
      kehadiran: number | string;
      tugas: number | string;
      uts: number | string;
      uas: number | string;
    }) => {
      const res = await Api.post(`/dosen/kelas-kuliah/${id}/grading`, body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosen/kelas-kuliah/detail/grading', id] });
    }
  });
};
