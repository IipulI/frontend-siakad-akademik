import React from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

interface TableProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
  setId?: (id: string | null) => void;
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
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
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
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
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


export const TableAnnouncement = ({ data, tableHead, error, setId }: TableProps) => {
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
            return (
              <tr key={index} className="text-center">
                <td className="p-2 border text-sm border-black/50">
                  {row.tanggal}
                </td>
                <td className="p-2 border text-sm border-black/50">
                  {row.penulis}
                </td>
                  <td className="p-2 border text-sm border-black/50">
                    {row.judul}
                </td>
                <td className="p-2 border text-sm border-black/50 text-center" style={{ verticalAlign: "middle" }}>
                  <div
                    onClick={() => setId && setId(row.id)}
                    className="bg-primary-blueSoft cursor-pointer rounded-sm mx-auto flex items-center justify-center w-8 h-6"
                  >
                    <FaEye className="text-white w-4 h-4" />
                  </div>
                </td>
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