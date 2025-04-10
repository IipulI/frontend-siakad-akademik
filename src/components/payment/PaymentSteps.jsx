import { useState } from "react";

export default function PaymentSteps() {
  const [activeStep] = useState(1);

  const steps = [
    { id: 1, label: "Bayar Tagihan" },
    { id: 2, label: "Konfirmasi Pembayaran" },
    { id: 3, label: "Pembayaran Berhasil" },
  ];

  return (
    <div>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`py-5 px-4 border-b-2 ${
                activeStep === step.id
                  ? "border-primary-green text-primary-green"
                  : " text-primary-green opacity-60"
              }`}
            >
              {step.id}. {step.label}
            </div>
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
