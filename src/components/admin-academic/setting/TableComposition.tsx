import React from "react";

interface TableProps {
    data: Array<Record<string, any>>;
    tableHead: string[];
    error: string;
    setId?: (id: string | null) => void;
  } 

export default function TableComposition ({ data, tableHead, error }: TableProps) {
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
                    if(index === data.length - 1) {
                        return (
                            <td key={idx} className="p-2 border text-sm bg-gray-200 border-gray-300">
                                {cell}
                            </td>
                        )
                    } else {
                        return (
                            <td key={idx} className="p-2 border text-sm border-gray-300">
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