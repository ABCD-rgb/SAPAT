import {useState} from "react";
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'
import { FaEye } from "react-icons/fa";
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

  // Function to filter data to be shown
  const getRowData = (row) => {
    if (!row) return []
    if (page === 'formulations') {
      // Get the keys of the row excluding _id
      const orderedFields = ['code', 'name', 'description', 'animal_group', 'access']
      const rowData = orderedFields.map((field) => row[field] || '')
      return rowData
    }
    else if (page === 'ingredients') {
      const orderedFields = ['name', 'price', 'available', 'group']
      const rowData = orderedFields.map((field) => row[field] || '')
      rowData[2] = (Number(rowData[2]) === 1) ? "Yes" : "No"  // for 'available' field
      return rowData
    }
    else if (page === 'nutrients') {
      const orderedFields = ['abbreviation', 'name', 'unit', 'description', 'group']
      const rowData = orderedFields.map((field) => row[field] || '')
      return rowData
    }
    // for tables that shows all fields
    return Object.values(row)
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
                    {(onRowClick && cellIndex === 1) ? (
                    <span
                      onClick={() => onRowClick && onRowClick(row)}
                      className="group cursor-pointer text-deepbrown hover:text-white/80 hover:underline hover:bg-deepbrown font-medium inline-flex items-center gap-2 px-2 py-1 rounded"
                    >
                      {cell}
                      <FaEye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
              {actions && (
                <td className="flex justify-end gap-2">
                  <div
                    className={`${(row?.access && row.access !== 'owner') && 'tooltip tooltip-left'}`}
                    data-tip={`${(row?.access && row.access !== 'owner') && 'Only the owner can edit this formulation.'}`}
                  >
                    <button
                      disabled={row?.access && row?.access !== 'owner'}
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
                        } else {
                          onEdit(row)
                        }
                      }}
                    >
                      <RiPencilLine className="h-4 w-4"/>
                    </button>
                  </div>
                  <div
                    className={`${(row?.access && row.access !== 'owner') && 'tooltip tooltip-left'}`}
                    data-tip={`${(row?.access && row.access !== 'owner') && 'Only the owner can delete this formulation.'}`}
                  >
                    <button
                      disabled={row?.access !== 'owner'}
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
                        } else {
                          onDelete(row)
                        }
                      }}
                    >
                      <RiDeleteBinLine className="h-4 w-4"/>
                    </button>
                  </div>
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
