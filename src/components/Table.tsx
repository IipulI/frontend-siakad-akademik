import React from "react";

interface TableProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
}

const Table = ({ data, tableHead, error }: TableProps) => {
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
            const rowData = Object.values(row);
            return (
              <tr key={index} className="text-center">
                {rowData.map((cell, idx) => (
                  <td key={idx} className="p-2 border text-sm border-black/50">
                    {String(cell)}
                  </td>
                ))}
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

export default Table;
