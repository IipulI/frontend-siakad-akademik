# Catatan untuk Backend — Kelompok Mata Kuliah

Konteks: halaman **Edit Mata Kuliah** di modul OBE
(`/admin-akademik/obe/edit-mata-kuliah/:obeId/:mataKuliahId`).

`kelompokMataKuliahId` sekarang **sudah benar** dikembalikan oleh
`GET /akademik/obe/mata-kuliah/:id`, jadi nilai yang tersimpan untuk suatu
mata kuliah sudah bisa ditampilkan dengan akurat di form edit. Contoh nyata:

```json
{
  "kelompokMataKuliah": "-",
  "kelompokMataKuliahId": null
}
```

Masalahnya: **belum ada endpoint untuk mengambil daftar semua Kelompok Mata
Kuliah** yang bisa dipilih di dropdown. Sudah dicoba menurunkan opsi dari
`GET /akademik/obe/mata-kuliah` (list endpoint yang dipakai tabel utama),
tapi endpoint itu tidak menyertakan field kelompok sama sekali — field yang
ada di situ per baris cuma:
`id, kurikulum, kodeMk, namaMataKuliah, sks, jenisMk, prodiPengampu, statusPengisian`.

**Permintaan ke Backend**: endpoint list khusus untuk Kelompok Mata Kuliah,
misalnya `GET /akademik/kelompok-mata-kuliah` (nama pastinya terserah
Backend, tinggal dikabari ke frontend), yang mengembalikan minimal
`{id, nama}` per kelompok.
