import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '../../../components/layouts/MainLayout';
import PaymentSteps from '../../../components/payment/PaymentSteps';
import PaymentTable from '../../../components/payment/PaymentTable';
import PaymentConfirmation from '../../../components/payment/PaymentConfirmation';
import PaymentReceipt from '../../../components/payment/PaymentReceipt';
import { useTagihanAktif } from '../../../hooks/mahasiswa/useKeuanganMahasiswa';
import { ITagihan } from '../../../types/mahasiswa.types';

const PAYMENT_SESSION_KEY = 'paymentSession';

const opsiPembayaran = [
  { value: 'amanahummah', label: 'Ammanah Ummah' },
  { value: 'vabsi', label: 'Virtual Account BSI' },
  { value: 'vamuamalat', label: 'Virtual Account Bank Muamalat' },
];

export default function StudentPayment() {
  const [step, setStep] = useState(1);
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [batasWaktu, setBatasWaktu] = useState<Date | null>(null);

  // Menggunakan data dummy yang sinkron dengan dashboard (sisa tagihan = 2.400.000)
  const tagihanAktif: ITagihan[] = [
    {
      kodeInvoice: "INV-2026-001",
      metodeBayar: null,
      namaPeriode: "2024 Genap",
      tanggalTenggat: "2026-07-25",
      tanggalBayar: null,
      kodeKomponen: "SPP",
      namaTagihan: "Sumbangan Pembinaan Pendidikan (SPP)",
      nominalTagihan: 1500000,
      lunas: "belum lunas",
    },
    {
      kodeInvoice: "INV-2026-002",
      metodeBayar: null,
      namaPeriode: "2024 Genap",
      tanggalTenggat: "2026-07-25",
      tanggalBayar: null,
      kodeKomponen: "UTS",
      namaTagihan: "Biaya Ujian Tengah Semester (UTS)",
      nominalTagihan: 900000,
      lunas: "belum lunas",
    }
  ];
  const isLoading = false;
  const isError = false;

  const total = useMemo(() => {
    return tagihanAktif.reduce((acc: number, item: ITagihan) => acc + item.nominalTagihan, 0);
  }, [tagihanAktif]);

  useEffect(() => {
    const savedSession = localStorage.getItem(PAYMENT_SESSION_KEY);
    if (savedSession) {
      const { step, metode, total, deadline } = JSON.parse(savedSession);
      const deadlineDate = new Date(deadline);

      // Cek apakah sesi pembayaran sudah kedaluwarsa
      if (deadlineDate > new Date()) {
        // Jika masih valid, pulihkan state
        setStep(step);
        setMetodePembayaran(metode);
        setBatasWaktu(deadlineDate);
        // Anda mungkin juga perlu memulihkan 'total', tergantung logika Anda
      } else {
        // Jika kedaluwarsa, hapus dari localStorage
        localStorage.removeItem(PAYMENT_SESSION_KEY);
      }
    }
  }, []);

  const handleProceedPayment = () => {
    if (tagihanAktif.length === 0) {
      alert('Tidak ada tagihan aktif untuk dibayar.');
      return;
    }
    if (!metodePembayaran) {
      alert('Silakan pilih metode pembayaran terlebih dahulu.');
      return;
    }

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 24);
    setBatasWaktu(deadline);

    const paymentSession = {
      step: 2,
      metode: metodePembayaran,
      total: total,
      deadline: deadline.toISOString(),
    };
    localStorage.setItem(PAYMENT_SESSION_KEY, JSON.stringify(paymentSession));

    setStep(2);
  };

  const labelMetode = opsiPembayaran.find(opt => opt.value === metodePembayaran)?.label || metodePembayaran;

  return (
      <MainLayout titlePage="Tagihan Mahasiswa" isGreeting={false}>
        <div className="space-y-4">
          <PaymentSteps step={step} setStep={setStep} />
          {step === 1 && (
              <PaymentTable
                  paymentOptions={opsiPembayaran}
                  data={tagihanAktif}
                  loading={isLoading}
                  error={isError}
                  total={total}
                  onProceed={handleProceedPayment}
                  selectedMethod={metodePembayaran}
                  onMethodChange={setMetodePembayaran}
              />
          )}
          {step === 2 && (
              <PaymentConfirmation
                  method={metodePembayaran}
                  total={total}
                  deadline={batasWaktu}
              />
          )}
          {/* Contoh jika ada Langkah 3 */}
          {step === 3 && (
              <PaymentReceipt
                  bills={tagihanAktif}
                  total={total}
                  method={labelMetode}
                  paymentDate={new Date()}
              />
          )}
        </div>
      </MainLayout>
  );
}