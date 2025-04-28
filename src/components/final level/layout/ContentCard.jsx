export default function ContentCard({
  children,
  className = "bg-white rounded-md border-t-2 border-primary-yellow mb-10 h-lvh",
}) {
  return (
    <div className={className}>
      <div className="py-10">{children}</div>
    </div>
  );
}
