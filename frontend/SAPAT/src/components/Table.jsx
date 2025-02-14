import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'

function Table({ headers, data, onEdit, onDelete, onRowClick, actions = true }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="text-deepbrown">
                  {header}
                </th>
              ))}
              {actions && <th className="text-right text-deepbrown">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover cursor-pointer"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {Object.values(row).map((cell, cellIndex) => (
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
                      <RiPencilLine className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(row)
                      }}
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table

