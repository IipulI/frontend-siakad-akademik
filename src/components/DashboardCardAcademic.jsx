export default function DashboardCardAcademic({ number, title, color }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h1 className={`${color} font-semibold text-2xl`}>{number}</h1>
      <h1 className="text-primary-brown font-semibold opacity-65 text-sm">
        {title}
      </h1>
    </div>
  );
}
