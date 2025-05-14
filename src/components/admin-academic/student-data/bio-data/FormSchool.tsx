import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";

export default function FormSchool() {
  const statusHidupOptions = [
    { value: "", label: "-- Pilih Status Hidup --" },
    { value: "hidup", label: "Hidup" },
    { value: "meninggal", label: "Meninggal" },
  ];

  const statusKerabatanOptions = [
    { value: "", label: "-- Pilih Status kekerabatan --" },
    { value: "kandung", label: "Kandung" },
    { value: "tiri", label: "Tiri" },
    { value: "angkat", label: "Angkat" },
    { value: "wali", label: "Wali" },
  ];

  const pendidikanOptions = [
    { value: "", label: "-- Pilih Pendidikan terakhir --" },
    { value: "sd", label: "SD" },
    { value: "smp", label: "SMP" },
    { value: "sma", label: "SMA/SMK" },
    { value: "d1", label: "D1" },
    { value: "d2", label: "D2" },
    { value: "d3", label: "D3" },
    { value: "d4", label: "D4" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
  ];

  const pekerjaanOptions = [
    { value: "", label: "-- Pilih Pekerjaan --" },
    { value: "pns", label: "PNS" },
    { value: "swasta", label: "Karyawan Swasta" },
    { value: "wiraswasta", label: "Wiraswasta" },
    { value: "tni_polri", label: "TNI/POLRI" },
    { value: "petani", label: "Petani" },
    { value: "nelayan", label: "Nelayan" },
    { value: "buruh", label: "Buruh" },
    { value: "pensiunan", label: "Pensiunan" },
    { value: "tidak_bekerja", label: "Tidak Bekerja" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const penghasilanOptions = [
    { value: "", label: "-- Pilih Penghasilan --" },
    { value: "1", label: "< Rp. 1.000.000" },
    { value: "2", label: "Rp. 1.000.000 - Rp. 3.000.000" },
    { value: "3", label: "Rp. 3.000.000 - Rp. 5.000.000" },
    { value: "4", label: "> Rp. 5.000.000" },
  ];

  return (
    <LayoutForTabNavigation className="-mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 border-1 border-gray-400 p-3">
      {/* Sekolah Section */}
      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <SelectInput label="Pendidikan Asal" options={statusHidupOptions} />
            <SelectInput
              label="Provinsi Sekolah"
              options={statusHidupOptions}
            />
            <TextInput label="Kota Sekolah" />
            <TextInput label="Sekolah" placeHolder="Cari Sekolah" />
            <TextInput label="Alamat Sekolah" />
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput label="Telepon Sekolah" />
            <TextInput label="Nomor Ijazah Sekolah" />

            {/* NISN */}
            <div className="grid grid-cols-2 items-center">
              <label
                htmlFor=""
                className=" w-fit font-medium text-sm sm:text-base"
              >
                NISN
              </label>
              <div>
                <input
                  type="text"
                  className="bg-white border text-sm sm:text-base w-full border-gray-300 text-black/60 font-semibold  rounded focus:ring-blue-500 focus:border-blue-500 p-1"
                />
                <p className="text-xs font-medium">
                  Cari data nisn{" "}
                  <a href="" className="text-blue-400">
                    klik disini
                  </a>
                </p>
              </div>
            </div>

            {/* File Ijazah */}
            <div className=" w-full grid grid-cols-2 items-center">
              <label className="text-sm font-medium mb-1">
                File Ijazah Terakhir
              </label>
              <div>
                <input type="file" className="text-xs border-1 p-0.5 w-30" />
                <div className="text-xs text-primary-green">
                  pdf, jpg (maxsize: 2 MB)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
