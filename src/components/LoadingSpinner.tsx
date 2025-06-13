interface LoadingSpinnerProps {
  title?: string;
}
export default function LoadingSpinner({ title }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
      <p className="text-gray-700 text-lg">Sedang mengambil data {title}</p>
    </div>
  );
}
