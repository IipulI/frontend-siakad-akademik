import React from "react";

interface TableRow {
  id: string | number;
  [key: string]: any;
}

interface TableProps {
  headers: string[];
  data: TableRow[];
  showCheckbox?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  renderCustomCell?: (
    key: string,
    value: any,
    rowData: TableRow
  ) => React.ReactNode;
}

export default function Table({
  headers = [],
  data = [],
  showCheckbox = true,
  className = "",
  headerClassName = "bg-primary-green text-white p-2 border border-gray-500 font-semibold",
  cellClassName = "border border-gray-500 font-semibold p-2 text-center",
  renderCustomCell,
}: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {showCheckbox && (
              <th className={headerClassName}>
                <input type="checkbox" className="w-4 h-4" />
              </th>
            )}
            {headers.map((header, index) => (
              <th key={index} className={headerClassName}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {showCheckbox && (
                <td className={cellClassName}>
                  <input type="checkbox" className="w-4 h-4" />
                </td>
              )}
              {Object.keys(row)
                .filter((key) => key !== "id")
                .map((key, cellIndex) => (
                  <td key={cellIndex} className={cellClassName}>
                    {renderCustomCell
                      ? renderCustomCell(key, row[key], row)
                      : row[key]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
