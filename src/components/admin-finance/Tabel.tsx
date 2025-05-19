import React from "react";
import ButtonClick from "../admin-academic/student-data/ButtonClick";
import { Eye, Pen, Trash2 } from "lucide-react";

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
  actions?: {
    edit?: (row: TableRow) => void;
    delete?: (row: TableRow) => void;
    view?: (row: TableRow) => void;
  };
  showActions?: boolean;
}

export default function Table({
  headers = [],
  data = [],
  showCheckbox = true,
  className = "",
  headerClassName = "bg-primary-green text-white p-2 border border-gray-500 font-semibold",
  cellClassName = "border border-gray-500 font-semibold p-2 text-center",
  renderCustomCell,
  actions,
  showActions = true,
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
            {showActions && actions && (
              <th className={headerClassName}>Aksi</th>
            )}
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
              {showActions && actions && (
                <td className={`${cellClassName}`}>
                  <div className={` flex justify-center gap-2`}>
                    {actions.view && (
                      <ButtonClick
                        icon={<Eye size={16} />}
                        color="bg-primary-blueSoft"
                        onClick={() => actions.view?.(row)}
                      />
                    )}
                    {actions.edit && (
                      <ButtonClick
                        icon={<Pen size={16} />}
                        color="bg-primary-yellow"
                        onClick={() => actions.edit?.(row)}
                      />
                    )}
                    {actions.delete && (
                      <ButtonClick
                        icon={<Trash2 size={16} />}
                        color="bg-red-500"
                        onClick={() => actions.delete?.(row)}
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
