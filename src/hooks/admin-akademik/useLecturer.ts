// src/hooks/admin-akademik/useLecturer.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  lecturerService,
  LecturerListParams,
  LecturerListResponse,
  LecturerData,
} from "../../api/admin-academic/lecturerService";

// GET - daftar dosen dengan pagination & filter
export function useLecturerData(params: LecturerListParams) {
  return useQuery<LecturerListResponse>({
    queryKey: ["getLecturerData", params],
    queryFn: () => lecturerService.getList(params),
    refetchOnWindowFocus: false,
  });
}

// GET - detail satu dosen
export function useLecturerDetail(id: string) {
  return useQuery<LecturerData>({
    queryKey: ["getLecturerDetail", id],
    queryFn: () => lecturerService.getDetail(id),
    enabled: !!id,
  });
}

// POST - sinkronisasi data dosen dari Simpeg
export function useSyncSimpeg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lecturerService.syncSimpeg(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLecturerData"] });
    },
  });
}
