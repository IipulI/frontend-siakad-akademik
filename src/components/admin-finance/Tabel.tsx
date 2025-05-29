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
  headerClassName = "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base",
  cellClassName = "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base",
  renderCustomCell,
  actions,
  showActions = true,
}: TableProps) {
  // Generate unique row ID if missing
  const generateRowId = (row: TableRow, index: number): string => {
    if (row.id !== undefined && row.id !== null && row.id !== "") {
      return `row-${row.id}`;
    }
    return `row-fallback-${index}`;
  };

  // Get filtered keys (excluding id) consistently
  const getRowKeys = (row: TableRow): string[] => {
    return Object.keys(row).filter((key) => key !== "id");
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {showCheckbox && (
              <th className={headerClassName}>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={() => {}} // Add onChange handler to avoid React warning
                />
              </th>
            )}
            {headers.map((header, index) => (
              <th
                key={`header-${header
                  .replace(/\s+/g, "-")
                  .toLowerCase()}-${index}`}
                className={headerClassName}
              >
                {header}
              </th>
            ))}
            {showActions && actions && (
              <th className={headerClassName}>Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const uniqueRowId = generateRowId(row, rowIndex);
            const rowKeys = getRowKeys(row);

            return (
              <tr key={uniqueRowId}>
                {showCheckbox && (
                  <td className={cellClassName}>
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      onChange={() => {}} // Add onChange handler
                    />
                  </td>
                )}
                {rowKeys.map((key, cellIndex) => (
                  <td
                    key={`${uniqueRowId}-cell-${key}-${cellIndex}`}
                    className={cellClassName}
                  >
                    {renderCustomCell
                      ? renderCustomCell(key, row[key], row)
                      : row[key] ?? "-"}{" "}
                    {/* Handle null/undefined values */}
                  </td>
                ))}
                {showActions && actions && (
                  <td className={cellClassName}>
                    <div className="flex justify-center gap-2">
                      {actions.view && (
                        <ButtonClick
                          key={`${uniqueRowId}-view`}
                          icon={<Eye size={16} />}
                          color="bg-primary-blueSoft"
                          onClick={() => actions.view?.(row)}
                        />
                      )}
                      {actions.edit && (
                        <ButtonClick
                          key={`${uniqueRowId}-edit`}
                          icon={<Pen size={16} />}
                          color="bg-primary-yellow"
                          onClick={() => actions.edit?.(row)}
                        />
                      )}
                      {actions.delete && (
                        <ButtonClick
                          key={`${uniqueRowId}-delete`}
                          icon={<Trash2 size={16} />}
                          color="bg-red-500"
                          onClick={() => actions.delete?.(row)}
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada data untuk ditampilkan
        </div>
      )}
    </div>
  );
}
