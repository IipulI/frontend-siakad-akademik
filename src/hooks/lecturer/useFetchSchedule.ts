import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useScheduleList = (periodeAkademik: string) =>
    useQuery({
      queryKey: ['dosen/jadwal', periodeAkademik],
        queryFn: async () => {
            const res = await Api.get(`/dosen/jadwal/${periodeAkademik}`)
            return res.data
        },
        enabled: !!periodeAkademik
})
