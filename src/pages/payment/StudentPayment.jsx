// import MainLayout from "../layout/MainLayout";
// import PaymentSteps from "./PaymentSteps";
// import PaymentTable from "./PaymentTable";
import MainLayout from "../../components/layouts/MainLayout";
import PaymentSteps from "../../components/payment/PaymentSteps";
import PaymentTable from "../../components/payment/PaymentTable";

export default function StudentPayment() {
  const paymentData = [
    {
      id: 1,
      name: "Ujian Akhir Semester",
      category: "Sekali Bayar",
      discount: "-",
      penalty: "-",
      amount: 900000,
      status: "Telat bayar sejak 1 Maret 2025",
    },
    {
      id: 2,
      name: "Kerja Praktik",
      category: "Sekali Bayar",
      discount: "-",
      penalty: "-",
      amount: 300000,
      status: "Telat bayar sejak 1 Maret 2025",
    },
    {
      id: 3,
      name: "SKS",
      category: "Sekali Bayar",
      discount: "-",
      penalty: "-",
      amount: 2100000,
      status: "Telat bayar sejak 1 Maret 2025",
    },
  ];

  const total = paymentData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <MainLayout titlePage="Tagihan Mahasiswa">
      <PaymentSteps />
      <PaymentTable data={paymentData} total={total} />
    </MainLayout>
  );
}
