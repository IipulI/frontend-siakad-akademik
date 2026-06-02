// src/api/academic/obeService.ts
import { Api } from '../Index'; // Sesuai struktur src/api/Index.tsx
import { MataKuliahOBE, ObeFilters, PaginatedResponse } from '../../types/obe.types';

export const getObeMataKuliah = async (
  filters: ObeFilters
): Promise<PaginatedResponse<MataKuliahOBE>> => {
  const { data } = await Api.get('/api/akademik/obe/mata-kuliah', {
    params: filters,
  });
  return data;
};