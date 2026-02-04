export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 dark:text-gray-400"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}