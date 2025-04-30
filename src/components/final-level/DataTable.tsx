import React from "react";

interface DataTableProps {
  columns: {
    header: string;
    accessor: string;
    render?: (item: void) => React.ReactNode;
  }[];
  header: string;
  emptyMessage: string;
  data: any[];
  tableClassName: string;
  headerClassName: string;
  rowClassName: string;
}

export default function DataTable({
  columns,
  data,
  emptyMessage = "Data kosong",
  tableClassName = " w-full border-collapse border-2 text-sm xl:text-base shrink-0",
  headerClassName = "bg-primary-green text-white font-semibold text-center",
  rowClassName = "border-b border-gray-200",
}: DataTableProps) {
  return (
    <div className="overflow-x-auto flex">
      <table className={tableClassName}>
        <thead>
          <tr className={headerClassName}>
            {columns.map((column, index) => (
              <th key={index} className="p-3 border-1">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className={rowClassName}>
              <td
                colSpan={columns?.length || 0}
                className="p-3 text-center font-semibold"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className={rowClassName}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-3">
                    {column.render
                      ? column.render(item)
                      : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
