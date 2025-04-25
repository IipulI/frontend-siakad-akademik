export default function ContentCard({
  children,
  className = "bg-white rounded-md border-t-2 border-primary-yellow mb-10",
}) {
  return (
    <div className={className}>
      <div className="py-4">{children}</div>
    </div>
  );
}
