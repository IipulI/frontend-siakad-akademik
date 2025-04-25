export default function DataTable({
  columns,
  data,
  emptyMessage = "Data kosong",
  tableClassName = "w-full border-collapse border-2 text-sm xl:text-base",
  headerClassName = "bg-primary-green text-white font-semibold text-center",
  rowClassName = "border-b border-gray-200",
}) {
  return (
    <div className="overflow-x-auto">
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
                colSpan={columns.length}
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
