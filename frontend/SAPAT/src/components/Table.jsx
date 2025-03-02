import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'

function Table({
  headers,
  data,
  page,
  onEdit,
  onDelete,
  onRowClick,
  actions = true,
}) {
  // Function to filter out the _id when rendering rows
  const getRowData = (row) => {
    if (!row) return []
    if (page === 'formulations') {
      // Get the keys of the row excluding _id
      const orderedFields = ['code', 'name', 'description', 'animal_group', 'access']
      const rowData = orderedFields.map((field) => row[field] || '')
      return rowData
    }
  };

  return (
    <div className="h-full overflow-auto rounded-lg bg-white shadow-sm">
      <table className="table w-full">
        <thead className="sticky top-0 bg-white shadow-sm">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="text-deepbrown bg-white">
                {header}
              </th>
            ))}
            {actions && (
              <th className="text-deepbrown bg-white text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {getRowData(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {actions && (
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-ghost btn-sm text-deepbrown hover:bg-deepbrown/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(row)
                    }}
                  >
                    <RiPencilLine className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(row)
                    }}
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
