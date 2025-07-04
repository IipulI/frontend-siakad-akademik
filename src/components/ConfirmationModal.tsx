export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 rounded-md">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
            <span className="text-white text-4xl font-bold italic">i</span>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>

          <p className="text-gray-600 mb-8">{message}</p>

          <div className="flex justify-center gap-4 w-full">
            <button onClick={onClose} className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full font-semibold">
              Batalkan
            </button>
            <button onClick={onConfirm} className="px-6 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 w-full font-semibold">
              Ya, Yakin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
