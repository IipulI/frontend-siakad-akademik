import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface BreadcrumbLabelContextType {
  labels: Record<string, string>;
  setLabel: (id: string, label: string) => void;
  clearLabel: (id: string) => void;
}

const BreadcrumbLabelContext = createContext<BreadcrumbLabelContextType | undefined>(undefined);

export const BreadcrumbLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const setLabel = useCallback((id: string, label: string) => {
    setLabels((prev) => (prev[id] === label ? prev : { ...prev, [id]: label }));
  }, []);

  const clearLabel = useCallback((id: string) => {
    setLabels((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  return (
    <BreadcrumbLabelContext.Provider value={{ labels, setLabel, clearLabel }}>
      {children}
    </BreadcrumbLabelContext.Provider>
  );
};

export const useBreadcrumbLabels = () => {
  const ctx = useContext(BreadcrumbLabelContext);
  if (!ctx) throw new Error("useBreadcrumbLabels must be used within BreadcrumbLabelProvider");
  return ctx;
};

// Dipanggil di halaman detail (mata kuliah, kelas, dll) begitu nama entitasnya
// kefetch, supaya Breadcrumb bisa nampilin nama itu menggantikan ID mentah di URL.
// Otomatis dibersihkan pas halamannya di-unmount atau id/label-nya berubah.
export function useSetBreadcrumbLabel(id: string | undefined | null, label: string | undefined | null) {
  const { setLabel, clearLabel } = useBreadcrumbLabels();
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevIdRef.current && prevIdRef.current !== id) {
      clearLabel(prevIdRef.current);
    }
    if (id && label) {
      setLabel(id, label);
      prevIdRef.current = id;
    } else {
      prevIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, label]);

  useEffect(() => {
    return () => {
      if (prevIdRef.current) clearLabel(prevIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
