export default function ExamToggleButton({ children, active }) {
  return (
    <button
      className={`rounded-xl ${
        active && `bg-white shadow-xl`
      } py-1 px-3 text-[#7A7A7A] font-medium`}
    >
      {children}
    </button>
  );
}
