import React from "react";

interface DataStudentItem {
  label: string;
  value?: string | number;
  bold?: boolean;
}

interface DataStudentProps {
  data: DataStudentItem[];
  columns?: number;
}

const DataStudent: React.FC<DataStudentProps> = ({ data, columns = 2 }) => {
  // Split data into rows for the grid
  const rows: DataStudentItem[][] = [];
  for (let i = 0; i < data.length; i += columns) {
    rows.push(data.slice(i, i + columns));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 w-full">
      <div className="grid grid-cols-4 gap-x-6 gap-y-2 w-full">
        {rows.map((row, rowIndex) =>
          row.map((item, colIndex) => (
            <React.Fragment key={rowIndex + '-' + colIndex}>
              <div className="text-sm text-gray-700 flex items-center font-medium">
                {item.label}
              </div>
              <div className={`text-sm flex items-center ${item.bold ? 'font-bold' : 'font-normal'} bg-gray-50 rounded px-2 py-1 min-h-[32px]`}
                >
                {item.value || ''}
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default DataStudent; 