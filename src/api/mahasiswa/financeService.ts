import { Api } from "../Index";
import { IApiResponseWithData } from "../../types/common.types";
import { IPaymentNotifyPayload, ITagihan, ITagihanDetail } from "../../types/mahasiswa.types";

// --- Interface untuk parameter filter ---
interface HistoriParams {
    namaPeriode?: string;
    keyword?: string;
}

/**
 * Mengambil daftar tagihan aktif (belum lunas) untuk mahasiswa.
 * GET /mahasiswa/keuangan/tagihan-aktif
 */
const getTagihanAktif = async (): Promise<IApiResponseWithData<ITagihan[]>> => {
    try {
        const response = await Api.get<IApiResponseWithData<ITagihan[]>>(
            "/mahasiswa/pembayaran/tagihan-aktif"
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching active bills:", error);
        throw error;
    }
};

/**
 * Mengambil histori tagihan yang sudah lunas (tanpa paginasi).
 * GET /mahasiswa/keuangan/histori-tagihan
 */
const getHistoriTagihan = async (
    params: HistoriParams
): Promise<IApiResponseWithData<ITagihan[]>> => {
    try {
        const response = await Api.get<IApiResponseWithData<ITagihan[]>>(
            "/mahasiswa/keuangan/histori-tagihan",
            { params }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching bill history:", error);
        throw error;
    }
};

/**
 * Mengambil detail lengkap untuk satu invoice transaksi.
 * GET /mahasiswa/keuangan/histori-tagihan/{invoiceId}
 */
const getDetailTagihan = async (
    invoiceId: string
): Promise<IApiResponseWithData<ITagihanDetail>> => {
    try {
        const response = await Api.get<IApiResponseWithData<ITagihanDetail>>(
            `/mahasiswa/keuangan/histori-tagihan/${invoiceId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching bill detail:", error);
        throw error;
    }
};

const notifyPaymentStep3 = async (payload: IPaymentNotifyPayload): Promise<any> => {
    try {
        // Ganti URL endpoint sesuai dengan API backend Anda
        const response = await Api.post(
            "/mahasiswa/pembayaran/notify-step-3",
            payload
        );
        return response.data;
    } catch (error) {
        console.error("Error notifying payment step 3:", error);
        throw error;
    }
};

export const financeService = {
    getTagihanAktif,
    getHistoriTagihan,
    getDetailTagihan,
    notifyPaymentStep3,
};