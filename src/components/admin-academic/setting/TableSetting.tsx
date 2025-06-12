import { Pencil, Trash } from "lucide-react";
import React from "react";

interface TableProps {
    data: Array<Record<string, any>>;
    tableHead: string[];
    error: string;
    setId?: (id: string | null) => void;
  } 

export default function TableSetting ({ data, tableHead, error }: TableProps) {
    return (
      <table className="w-full my-4">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="p-4 bg-primary-green text-white border border-gray-600"
              >
                <p className="font-semibold text-center">{head}</p>
              </th>
            ))}
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
                                className="p-2 border text-center text-sm border-gray-300"
                            >
                                <div className="flex items-center justify-center w-full">
                                <div className="flex items-center justify-center space-x-2">
                                    <div
                                    // onClick={() => setId && setId(cell.id)}
                                    className="bg-primary-yellow cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                                    >
                                        <Pencil className="text-white w-4 h-4" />
                                    </div>
                                    <div
                                    onClick={() => confirm("Apakah anda yakin ingin menghapus ini?")}
                                    className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                                    >
                                        <Trash className="text-white w-4 h-4" />
                                    </div>
                                </div>
                                </div>
                            </td>
                        )
                    } else {
                        return (
                            <td key={idx} className="p-2 border lg:text-sm text-xs border-gray-300">
                                {cell}
                            </td>
                        )
                    }
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={tableHead.length}
                className="text-center border-black border p-2"
              >
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };