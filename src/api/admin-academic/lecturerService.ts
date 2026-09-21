// src/api/admin-academic/lecturerService.ts
import { Api } from "../Index";
import { IPaginatedResponse, IApiResponseWithData } from "../../types/common.types";

// TODO: ganti sesuai endpoint asli dari backend
const ENDPOINT = "/akademik/dosen";

export interface LecturerData {
  id: string;
  nip: string;
  nama: string;
  jenisKelamin: string; // "LAKI-LAKI" | "PEREMPUAN"
  nidn: string | null;
  gelarDepan: string | null;
  gelarBelakang: string | null;
  emailPegawai: string | null;
  jabatanFungsional: string | null;
  statusAktif: string;
  // TODO: field berikut belum tersedia di response list /akademik/dosen saat ini
  nuptk?: string;
  noTelp?: string;
  homeBase?: string;
  jenisPegawai?: string;
}

export interface LecturerListParams {
  page?: number;
  size?: number;
  keyword?: string;
  homeBase?: string;
  jenisPegawai?: string;
  jenisKelamin?: string;
  status?: string;
}

export type LecturerListResponse = IPaginatedResponse<LecturerData>;

export interface SyncSimpegResult {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
}

export const lecturerService = {
  /**
   * Mengambil daftar dosen dengan pagination & filter.
   * GET /akademik/dosen
   */
  getList: async (
    params: LecturerListParams
  ): Promise<LecturerListResponse> => {
    // TODO: sesuaikan nama query param ini dengan yang diterima backend
    const query: Record<string, string | number> = {
      page: params.page ?? 1,
      size: params.size ?? 10,
    };
    if (params.keyword?.trim()) query.search = params.keyword.trim();
    if (params.homeBase?.trim()) query.homeBase = params.homeBase.trim();
    if (params.jenisPegawai?.trim())
      query.jenisPegawai = params.jenisPegawai.trim();
    if (params.jenisKelamin?.trim())
      query.jenisKelamin = params.jenisKelamin.trim();
    if (params.status?.trim()) query.status = params.status.trim();

    try {
      const response = await Api.get<LecturerListResponse>(ENDPOINT, {
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching lecturer list:", error);
      throw error;
    }
  },

  /**
   * Mengambil detail satu dosen.
   * GET /akademik/dosen/{id}
   */
  getDetail: async (id: string): Promise<LecturerData> => {
    try {
      const response = await Api.get<IApiResponseWithData<LecturerData>>(
        `${ENDPOINT}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching lecturer detail with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Menyinkronkan data dosen dari Simpeg.
   * POST /akademik/dosen/sync-simpeg
   */
  syncSimpeg: async (): Promise<SyncSimpegResult> => {
    try {
      const response = await Api.post<IApiResponseWithData<SyncSimpegResult>>(
        `${ENDPOINT}/sync-simpeg`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error syncing lecturer data from Simpeg:", error);
      throw error;
    }
  },
};
