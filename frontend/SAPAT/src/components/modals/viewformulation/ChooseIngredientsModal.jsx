import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'

function ChooseIngredientsModal({ isOpen, onClose, ingredients }) {
  const [checkedIngredients, setCheckedIngredients] = useState([])

  const handleRowClick = (ingredient) => {
    const isChecked = checkedIngredients.includes(ingredient._id)
    if (isChecked) {
      setCheckedIngredients(
        checkedIngredients.filter((item) => item !== ingredient._id)
      )
    } else {
      setCheckedIngredients([...checkedIngredients, ingredient._id])
    }
  }

  const handleCheckboxChange = (ingredient, e) => {
    if (e.target.checked) {
      setCheckedIngredients([...checkedIngredients, ingredient._id])
    } else {
      setCheckedIngredients(
        checkedIngredients.filter((item) => item !== ingredient._id)
      )
    }
  }

  return (
    <dialog
      id="choose_ingredients_modal"
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
          Choose Ingredients
        </h3>
        <p className="mb-4 text-sm text-gray-500">Description</p>

        {/* Ingredients table */}
        <div className="max-h-64 overflow-hidden overflow-y-auto rounded-2xl border border-gray-200">
          <table className="table-pin-rows table">
            <thead className="bg-gray-50">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      if (isChecked) {
                        setCheckedIngredients(
                          ingredients.map((ingredient) => ingredient._id)
                        )
                      } else {
                        setCheckedIngredients([])
                      }
                    }}
                  />
                </th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Price</th>
                <th className="font-semibold">Available</th>
                <th className="font-semibold">Group</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr
                  key={index}
                  className={`hover ${checkedIngredients.includes(ingredient._id) ? 'bg-blue-100' : ''}`}
                  onClick={() => handleRowClick(ingredient)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedIngredients.includes(ingredient._id)}
                      onChange={(e) => handleCheckboxChange(ingredient, e)}
                    />
                  </td>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.price}</td>
                  <td>{ingredient.available}</td>
                  <td>{ingredient.group}</td>
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ChooseIngredientsModal
