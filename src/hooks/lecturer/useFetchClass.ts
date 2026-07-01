// hooks/useLecturerClass.ts
import { useQuery } from "@tanstack/react-query";
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
      const res = await Api.get(`/akademik/dosen/kelas`, {
        params: {
          search: keyword,
          siakPeriodeAkademikId: periodeAkademikId || undefined,
          siakProgramStudiId: programStudi || undefined,
          siakSistemKuliahId: sistemKuliah || undefined,
          page,
          size
        }
      });

      const items = res.data.items || res.data.data || [];
      const mappedData = items.map((row: any) => {
        const dosenList = Array.from(
          new Set(
            row.jadwalKuliah?.map((j: any) => j.dosen?.nama).filter(Boolean)
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
            id: row.programStudi?.id || '',
            namaProgramStudi: row.programStudi?.nama || '-',
          },
          kunci: row.statusPenilaian === 'Dikunci' || row.status_penilaian === 'Dikunci' || false,
        };
      });

      return {
        data: mappedData,
        pagination: {
          totalPages: res.data.totalPage || 1,
          totalItems: res.data.total || 0
        }
      };
    },
});

export const useClassDetail = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail', id],
    queryFn: async () => {
      const res = await Api.get(`/akademik/dosen/kelas/${id}`);
      const raw = res.data.data || res.data;
      if (!raw) return null;
      return {
        id: raw.id,
        nama: raw.nama,
        kapasitas: raw.kapasitas,
        jumlahPertemuan: raw.jumlahPertemuan,
        tanggalMulai: raw.tanggalMulai,
        tanggalSelesai: raw.tanggalSelesai,
        sistemKuliah: raw.sistemKuliah || raw.sistem_kuliah,
        periodeAkademik: raw.periodeAkademik?.nama || raw.periodeAkademik,
        programStudi: {
          id: raw.programStudi?.id || '',
          namaProgramStudi: raw.programStudi?.nama || raw.programStudi?.namaProgramStudi || '-',
          jenjang: raw.programStudi?.jenjang || { jenjang: 'S1' }
        },
        mataKuliah: {
          id: raw.mataKuliah?.id || '',
          kodeMataKuliah: raw.mataKuliah?.kode || raw.mataKuliah?.kodeMataKuliah || '',
          namaMataKuliah: raw.mataKuliah?.nama || raw.mataKuliah?.namaMataKuliah || '',
          tahunKurikulum: raw.mataKuliah?.tahunKurikulum || raw.mataKuliah?.kurikulum || '-',
        }
      };
    },
    enabled: !!id
});

export const useClassParticipants = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail/peserta-kelas', id],
    queryFn: async () => {
      const res = await Api.get(`/akademik/dosen/kelas/${id}/peserta-kelas`);
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

