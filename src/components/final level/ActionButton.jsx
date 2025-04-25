export default function ActionButton({
  icon,
  label,
  onClick,
  bgColor,
  hoverColor,
}) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${hoverColor} text-white px-4 py-1.5 rounded-md flex items-center justify-center text-xs sm:text-sm xl:text-base cursor-pointer`}
    >
      {icon}
      {label && <p className="ml-3">{label}</p>}
    </button>
  );
}
