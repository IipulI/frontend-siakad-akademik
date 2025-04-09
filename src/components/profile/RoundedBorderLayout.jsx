export default function RoundedBorderLayout({ children, className }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 p-4 rounded-xl border ${className}`}
    >
      {children}
    </div>
  );
}
