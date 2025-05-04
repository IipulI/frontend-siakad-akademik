import React from "react";

interface TableProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
}

export const Table = ({ data, tableHead, error }: TableProps) => {
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

export const TableHistory = ({ data, tableHead, error }: TableProps) => {
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
        <tr>
          <td
            colSpan={4}
            className="border-black/50 text-sm text-center p-2 border"
          >
            Total SKS
          </td>
          <td className="border-black/50 text-sm border text-center p-2">25</td>
          <td
            colSpan={4}
            className="border-black/50 text-sm border text-center p-2"
          ></td>
        </tr>
        <tr>
          <td
            colSpan={4}
            className="border-black/50 text-center p-2 text-sm border"
          >
            Batas SKS
          </td>
          <td className="border-black/50 text-center p-2 text-sm border">25</td>
          <td
            colSpan={4}
            className="border-black/50 text-sm border text-center p-2"
          ></td>
        </tr>
      </tbody>
    </table>
  );
};
