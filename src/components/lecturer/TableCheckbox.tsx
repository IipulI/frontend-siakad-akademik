import React, { useState, useEffect, useRef } from "react"
import { Eye} from "lucide-react"

interface TableProps {
    data: Array<Record<string, any>>;
    tableHead: string[];
    error: string;
    setId?: (id: string | null) => void;
  }

export default function TableCheckbox ({
    tableHead,
    data,
    error,
    setId,
  }: TableProps) {
    const [selected, setSelected] = useState<number[]>([]);
    const selectAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!data || data.length === 0) return;
      if (selected.length === data.length) {
        selectAllRef.current && (selectAllRef.current.indeterminate = false);
        selectAllRef.current && (selectAllRef.current.checked = true);
      } else if (selected.length === 0) {
        selectAllRef.current && (selectAllRef.current.indeterminate = false);
        selectAllRef.current && (selectAllRef.current.checked = false);
      } else {
        selectAllRef.current && (selectAllRef.current.indeterminate = true);
      }
    }, [selected, data]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelected(data.map((row) => row.id));
      } else {
        setSelected([]);
      }
    };

    const handleSelectRow = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    return (
      <table className="w-full my-4">
        <thead>
          <tr>
            {tableHead.map((head, idx) => {
              if(idx === 0) {
                return(
                    <th
                        className="p-2 bg-primary-green text-white border border-gray-600"
                    >
                        <input
                        type="checkbox"
                        ref={selectAllRef}
                        onChange={handleSelectAll}
                        disabled={!data || data.length === 0}
                        />
                    </th>
                )
              } else {
                return (
                    <th key={head} 
                    className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
                    >
                        {head}
                    </th>
                )
              }
            })}
          </tr>
        </thead>
        <tbody className="font-semibold">
        {data && data.length > 0 ? (
            data.map((row, index) => {
              const { id, ...rowWithoutId } = row;
              const rowData = Object.values(rowWithoutId);
              return (
                <tr key={index} className="text-center">
                  {rowData.map((cell, idx) => {
                    if(idx === rowData.length - 1) {
                        return (
                            <td
                                key={idx}
                                className="p-2 border text-center text-sm border-black/50"
                            >
                                <div className="flex items-center justify-center w-full">
                                    <div
                                    onClick={() => setId && setId(row.id)}
                                    className="bg-primary-blueSoft cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                                    >
                                        <Eye className="text-white w-4 h-4" />
                                    </div>
                                </div>
                            </td>
                        )
                    } else if(idx === 0) {
                        return (
                            <td className="p-2 border text-center text-sm border-black/50">
                                <input
                                type="checkbox"
                                checked={selected.includes(row.id)}
                                onChange={() => handleSelectRow(row.id)}
                                />
                            </td>
                        )
                    } else {
                        return (
                            <td key={idx} className="p-2 border text-sm border-black/50">
                                {String(cell)}
                            </td>
                        )
                    }
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={tableHead.length} className="text-center border-black border p-2">
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };