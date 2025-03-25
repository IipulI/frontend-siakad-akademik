export default function DashboardBillCard({ title, price, pay = false }) {
  return (
    <div className="p-4 shadow-md bg-white w-full rounded-xl space-y-2">
      <h1 className="text-primary-blue font-semibold text-sm">{title}</h1>
      <h1 className="text-primary-brown text-2xl font-semibold">
        Rp. {price.toLocaleString("en-US")}
      </h1>
      {pay && (
        <button className="bg-primary-green w-full cursor-pointer rounded-md text-md font-semibold text-white py-2 px-4">
          Bayar Sekarang
        </button>
      )}
    </div>
  );
}
