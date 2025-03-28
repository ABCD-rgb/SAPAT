import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'

function ChooseNutrientsModal({ isOpen, onClose, nutrients, onResult }) {
  const [checkedNutrients, setCheckedNutrients] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    onResult(checkedNutrients)
  }

  const handleRowClick = (nutrient) => {
    const isChecked = checkedNutrients.some(
      (item) => item.nutrientId === nutrient._id
    )
    if (isChecked) {
      setCheckedNutrients(
        checkedNutrients.filter((item) => item.nutrientId !== nutrient._id)
      )
    } else {
      setCheckedNutrients([
        ...checkedNutrients,
        { nutrientId: nutrient._id, name: nutrient.name },
      ])
    }
  }

  const handleCheckboxChange = (nutrient, e) => {
    if (e.target.checked) {
      setCheckedNutrients([
        ...checkedNutrients,
        { nutrientId: nutrient._id, name: nutrient.name },
      ])
    } else {
      setCheckedNutrients(
        checkedNutrients.filter((item) => item.nutrientId !== nutrient._id)
      )
    }
  }

  return (
    <dialog
      id="choose_nutrients_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-3xl rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-4 text-lg font-bold">
          Choose Nutrients
        </h3>
        <p className="mb-4 text-sm text-gray-500">Description</p>

        {/* Nutrients table */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-64 overflow-y-auto rounded-2xl border border-gray-200">
            <table className="table-pin-rows table">
              <thead className="bg-gray-50">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        if (isChecked) {
                          setCheckedNutrients(
                            nutrients.map((nutrient) => {
                              return {
                                nutrientId: nutrient._id,
                                name: nutrient.name,
                              }
                            })
                          )
                        } else {
                          setCheckedNutrients([])
                        }
                      }}
                    />
                  </th>
                  <th className="font-semibold">Abbreviation</th>
                  <th className="font-semibold">Name</th>
                  <th className="font-semibold">Unit</th>
                  <th className="font-semibold">Group</th>
                </tr>
              </thead>
              <tbody>
                {nutrients.map((nutrient, index) => (
                  <tr
                    key={index}
                    className={`hover ${checkedNutrients.some((item) => item.nutrientId === nutrient._id) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleRowClick(nutrient)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedNutrients.some(
                          (item) => item.nutrientId === nutrient._id
                        )}
                        onChange={(e) => handleCheckboxChange(nutrient, e)}
                      />
                    </td>
                    <td>{nutrient.abbreviation}</td>
                    <td>{nutrient.name}</td>
                    <td>{nutrient.unit}</td>
                    <td>{nutrient.group}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal actions */}
          <div className="modal-action">
            <button className="btn rounded-xl px-8" onClick={onClose}>
              Cancel
            </button>
            <button className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600">
              Add
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ChooseNutrientsModal
