import { ReactNode } from "react";

interface BorderedGreenContainer {
  children: ReactNode;
}

export default function BorderedGreenContainer({
  children,
}: BorderedGreenContainer) {
  return (
    <div className="bg-white border-t-2 border-primary-green p-4 px-8 rounded-sm shadow-sm space-y-4">
      {children}
    </div>
  );
}
