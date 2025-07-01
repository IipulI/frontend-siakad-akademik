import React from "react"

export default function TableSchedule({data, hari}) {
    return (
        <div className="my-6 rounded-lg">
        <div className="border-t-3 border-primary-yellow py-2 font-semibold">
          {hari}
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-400">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Nama
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Kode
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Jam Mulai
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Jam Selesai
              </th>

              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Kelas
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Ruangan
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Dosen
              </th>
            </tr>
          </thead>
          <tbody className="text-black font-semibold">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="border border-gray-400">
                    <td className="p-2 border border-gray-300">{item.namaMataKuliah}</td>
                    <td className="p-2 border border-gray-300">{item.kodeMataKuliah}</td>
                    <td className="p-2 border border-gray-300">{item.jamMulai}</td>
                    <td className="p-2 border border-gray-300">{item.jamSelesai}</td>
                    <td className="p-2 border border-gray-300">{item.kelas}</td>
                    <td className="p-2 border border-gray-300">{item.ruangan}</td>
                    <td className="p-2 border border-gray-300">{item.dosen}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4 border-gray-300">
                  Tidak ada jadwal kuliah pada hari ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    )
}