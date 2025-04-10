export default function RoundedBorderLayout({ children, className }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 p-4 rounded-2xl border border-[#c0c0c0] ${className}`}
    >
      {children}
    </div>
  );
}
