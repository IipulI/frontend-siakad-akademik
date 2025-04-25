export default function FilterSection({
  children,
  className = "flex flex-col md:flex-row md:justify-between gap-5 md:gap-10 mb-4 items-center border-2 p-2 rounded",
}) {
  return <div className={className}>{children}</div>;
}
