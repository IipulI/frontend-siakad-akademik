import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '../../../components/layouts/MainLayout';
import PaymentSteps from '../../../components/payment/PaymentSteps';
import PaymentTable from '../../../components/payment/PaymentTable';
import PaymentConfirmation from '../../../components/payment/PaymentConfirmation';
import PaymentReceipt from '../../../components/payment/PaymentReceipt';
import { useNotifyPaymentStep3, useTagihanAktif } from '../../../hooks/mahasiswa/useKeuanganMahasiswa';
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

  const { data: tagihanAktif = [], isLoading, isError } = useTagihanAktif();

  const { mutate: notifyStep3 } = useNotifyPaymentStep3();

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

  const handleStepChange = (newStep: number) => {
    if (newStep === 3) {
      // Hit API menggunakan mutation, berjalan di background (fire-and-forget)
      notifyStep3({
        metode: metodePembayaran,
        total: total
      });
    }
    setStep(newStep);
  };

  const labelMetode = opsiPembayaran.find(opt => opt.value === metodePembayaran)?.label || metodePembayaran;

  return (
      <MainLayout titlePage="Tagihan Mahasiswa" isGreeting={false}>
        <div className="space-y-4">
          <PaymentSteps step={step} setStep={handleStepChange} />
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
                  onCheckStatus={() => handleStepChange(3)}
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