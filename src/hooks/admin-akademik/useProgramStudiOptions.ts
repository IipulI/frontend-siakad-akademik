import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";
import { IOption } from "../../types/models";

export interface IProgramStudiOption {
  id: string;
  nama: string;
  siakFakultasId: string | null;
}

const getAllProgramStudi = async (): Promise<IProgramStudiOption[]> => {
  const response = await Api.get<{ data: IProgramStudiOption[] }>(
    "/public/program-studi"
  );
  return response.data.data;
};

// Daftar Program Studi, opsional disaring berdasarkan Fakultas terpilih (dropdown bertingkat).
export const useProgramStudiOptions = (fakultasId?: string) => {
  const query = useQuery<IProgramStudiOption[], Error>({
    queryKey: ["programStudiOptions"],
    queryFn: getAllProgramStudi,
  });

  const filtered = (query.data || []).filter((p) =>
    fakultasId ? p.siakFakultasId === fakultasId : true
  );

  const options: IOption[] = filtered.map((p) => ({
    value: p.id,
    label: p.nama,
  }));

  return { ...query, options };
};
