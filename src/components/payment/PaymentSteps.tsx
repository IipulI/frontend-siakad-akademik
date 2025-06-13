import React from "react";

export default function PaymentSteps({ step, setStep }) {
  const steps = [
    { id: 1, label: "Bayar Tagihan" },
    { id: 2, label: "Konfirmasi Pembayaran" },
    { id: 3, label: "Pembayaran Berhasil" },
  ];

  return (
    <div>
      <div className="flex items-center">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setStep(s.id)}
              className={`py-5 sm:px-4 border-b-2 transition-all duration-300 text-sm md:text-base ${
                step === s.id
                  ? "border-primary-green text-primary-green font-semibold"
                  : "border-transparent text-primary-green opacity-60"
              }`}
            >
              {s.id}. {s.label}
            </button>
            {index < steps.length - 1 && (
              <span className="mx-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
