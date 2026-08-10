import MainLayout from "../components/layouts/MainLayout";

interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => (
  <MainLayout titlePage={title} isGreeting={false}>
    <div className="max-w-2xl mx-auto mt-2 bg-white py-16 rounded-sm border-t-2 border-primary-green flex flex-col items-center text-center px-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-500">
        Halaman ini sedang dalam pengembangan dan akan segera hadir.
      </p>
    </div>
  </MainLayout>
);

export default ComingSoon;
