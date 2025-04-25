export default function ActionButton({ 
  icon, 
  label, 
  onClick, 
  bgColor, 
  hoverColor = "hover:bg-blue-500" 
}) {
  return (
    <button 
      onClick={onClick}
      className={`${bgColor} ${hoverColor} text-white px-4 py-1.5 rounded-md flex items-center justify-center text-sm xl:text-base`}
    >
      {icon}
      {label && <p className="ml-3">{label}</p>}
    </button>
  );
}

