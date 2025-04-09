export default function RoundedBorderLayout({ children, className }) {
  return <div className={`p-4 rounded-xl border ${className}`}>{children}</div>;
}
