export default function FilterSection({
  children,
  className = "flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-10 mb-4 items-center border-2 p-2 rounded",
}) {
  return <div className={className}>{children}</div>;
}
