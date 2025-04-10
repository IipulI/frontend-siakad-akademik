export default function TabNavigationButton({
  children,
  isActive = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={
        isActive
          ? `w-full text-center bg-primary-green rounded-full p-1.5 text-white transition-all duration-500`
          : `w-full text-center bg-[#dddddd] rounded-full p-1.5 text-secondary-gray cursor-pointer`
      }
    >
      {children}
    </button>
  );
}
