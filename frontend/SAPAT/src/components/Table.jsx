import {useState} from "react";
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'
import Toast from '../components/Toast'

function Table({
  headers,
  data,
  page,
  onEdit,
  onDelete,
  onRowClick,
  actions = true,
}) {
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

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
              className="hover"
            >
              {getRowData(row).map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {/* only the name column (index 1) is clickable to go to ViewFormulation */}
                  {cellIndex === 1 ? (
                    <span
                      onClick={() => onRowClick && onRowClick(row)}
                      className="cursor-pointer text-deepbrown hover:text-white/80 hover:underline hover:bg-deepbrown font-medium"
                    >
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
              {actions && (
                <td className="flex justify-end gap-2">
                  <button
                    className={`btn btn-ghost btn-sm ${
                      (row?.access && row.access !== 'owner') ? 'cursor-not-allowed text-gray-500' : 'text-deepbrown hover:bg-deepbrown/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      // non-owners should not be able to edit the basic data
                      if (row?.access && row.access !== 'owner') {
                        // toast instructions
                        setShowToast(true)
                        setMessage('Only the owner can edit the basic data.')
                        setToastAction('error')
                      }
                      else {
                        onEdit(row)
                      }
                    }}
                  >
                    <RiPencilLine className="h-4 w-4" />
                  </button>
                  <button
                    className={`btn btn-ghost btn-sm ${
                      (row?.access && row.access !== 'owner') ? 'cursor-not-allowed text-gray-500' : 'text-red-600 hover:bg-deepbrown/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      // non-owners should not be able to edit the basic data
                      if (row?.access && row.access !== 'owner') {
                        // toast instructions
                        setShowToast(true)
                        setMessage('Only the owner can delete this formulation.')
                        setToastAction('error')
                      }
                      else {
                        onDelete(row)
                      }
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
      {/*  Toasts */}
      <Toast
        className="transition ease-in-out delay-150"
        show={showToast}
        action={toastAction}
        message={message}
        onHide={hideToast}
      />
    </div>
  )
}

export default Table
