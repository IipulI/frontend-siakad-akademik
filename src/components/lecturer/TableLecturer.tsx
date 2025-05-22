import { Eye } from "lucide-react";
import React from "react";
interface TableProps {
    data: Array<Record<string, any>>,
    tableHead: string[],
    error: string ,
    setId?: (id: string | null) => void;
}

export default function TableLecturer ({ data, tableHead, error, setId }: TableProps) {
    return (
      <table className="w-full my-4">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th key={head} 
              className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
              >
                {head}
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