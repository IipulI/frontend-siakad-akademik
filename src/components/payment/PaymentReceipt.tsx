import { MapPin, Phone } from "lucide-react";
import LogoUika from "../../../public/img/logo_uika.png";
export default function PaymentReceipt() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md border-t-4 border-primary-blueDark space-y-12 border-b-4">
      <div className="justify-between flex items-center">
        <img src={LogoUika} width={75} alt="" />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-primary-brown space-x-2 text-sm font-semibold">
            <MapPin />
            <span className="">
              Jl KH Sholeh Iskandar KM2
              <br /> Kedung Badak Bogor
            </span>
          </div>
          <div className="flex items-center text-primary-brown space-x-2 text-sm font-semibold">
            <Phone />
            <span className="">0251-8356884</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Bukti Pembayaran</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-8 text-lg">
            <ReceiptAttribute
              className="text-primary-blueDark"
              title="No. Transaksi"
              credential=":PAY/20242/0002325"
            />
            <ReceiptAttribute
              title="Periode Tagihan"
              credential=":2024 Genap"
            />
            <ReceiptAttribute
              title="Tanggal Bayar"
              credential=":26 Februari 2025"
            />
            <ReceiptAttribute
              title="Metode Bayar"
              credential=":Bank Amanah Ummah"
            />
          </div>
          <div className="flex flex-col space-y-8 text-lg">
            <ReceiptAttribute title="NIM" credential=":221106043035" />
            <ReceiptAttribute title="Nama" credential=":Maulana Ikhsan" />
            <ReceiptAttribute
              title="Program Studi"
              credential=":Teknik Informatika"
            />
            <ReceiptAttribute title="Periode Masuk" credential=":2022 Ganjil" />
          </div>
        </div>
        <ReceiptTable />
        <ReceiptSignature />
      </div>
    </div>
  );
}

interface ReceiptAttributeProps {
  className?: string;
  title: string;
  credential: string;
}

const ReceiptAttribute = ({
  className,
  title,
  credential,
}: ReceiptAttributeProps) => {
  return (
    <div className="flex items-center font-semibold text-base space-x-4">
      <span className="text-primary-brown">{title}</span>
      <p className={className ? className : "text-primary-brown"}>
        {credential}
      </p>
    </div>
  );
};

const ReceiptTable = () => {
  const data = [
    {
      name: "Ujian Akhir Semester",
      invoice: "INV/20242/0008779",
      nominal: "Rp900.000",
      denda: "-",
      potongan: "-",
      subtotal: "Rp900.000",
    },
    {
      name: "SKS",
      invoice: "INV/20242/0008778",
      nominal: "Rp2.100.000",
      denda: "-",
      potongan: "-",
      subtotal: "Rp2.100.000",
    },
    {
      name: "Kerja Praktik",
      invoice: "INV/20242/0008782",
      nominal: "Rp300.000",
      denda: "-",
      potongan: "-",
      subtotal: "Rp300.000",
    },
  ];

  const total = "Rp3.300.000";

  return (
    <div className="p-6 bg-white rounded-2xl shadow w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200 text-primary-blueDark">
            <th className="p-2">Nama Tagihan</th>
            <th className="p-2">Nominal</th>
            <th className="p-2">Denda</th>
            <th className="p-2">Potongan</th>
            <th className="p-2">Sub Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">{item.invoice}</div>
              </td>
              <td className="p-2">{item.nominal}</td>
              <td className="p-2">{item.denda}</td>
              <td className="p-2">{item.potongan}</td>
              <td className="p-2">{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 mx-auto">
        <div className="text-lg font-semibold">Total Pembayaran</div>
        <h1 className="text-primary-blueDark">{total}</h1>
      </div>
    </div>
  );
};

const ReceiptSignature = () => {
  return (
    <div className="p-6 bg-white rounded-2xl mt-6 text-sm text-primary-brown">
      <div className="flex justify-between mb-16">
        <div>
          <div>Bogor, 26 Februari 2025</div>
          <div className="font-semibold mt-2">Penerima</div>
        </div>
        <div>
          <div className="invisible">-</div> {/* Spacer */}
          <div className="font-semibold mt-2">Tertanda</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="font-bold">MUHAMMAD RIDHO FATHAN</div>
        <div className="font-semibold">Bagian keuangan</div>
      </div>
    </div>
  );
};
