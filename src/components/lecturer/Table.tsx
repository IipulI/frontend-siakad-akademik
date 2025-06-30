
const Table = ({ tanggal, dataKuliah }) => (
    <div className="my-6 rounded-lg">
      <div className="border-t-3 border-primary-yellow py-2 font-semibold">
        {tanggal}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-400">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Mulai
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Selesai
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Jenis
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Kuliah
              </th>

              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Ruang
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Pengajar
              </th>
            </tr>
          </thead>
          <tbody className="text-black font-semibold">
            {dataKuliah.length > 0 ? (
              dataKuliah.map((item, index) => (
                <JadwalKuliah key={index} {...item} />
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
  );

  export default Table