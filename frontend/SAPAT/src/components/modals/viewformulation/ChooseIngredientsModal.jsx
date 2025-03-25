import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'

function ChooseIngredientsModal({ isOpen, onClose, ingredients, onResult }) {
  const [checkedIngredients, setCheckedIngredients] = useState([])
  console.log('checkedIngredients on modal: ', checkedIngredients)

  const handleSubmit = (e) => {
    e.preventDefault()
    onResult(checkedIngredients)
  }

  const handleRowClick = (ingredient) => {
    const isChecked = checkedIngredients.some(
      (item) => item.ingredientId === ingredient._id
    )
    if (isChecked) {
      setCheckedIngredients(
        checkedIngredients.filter(
          (item) => item.ingredientId !== ingredient._id
        )
      )
    } else {
      setCheckedIngredients([
        ...checkedIngredients,
        { ingredientId: ingredient._id, name: ingredient.name },
      ])
    }
  }

  const handleCheckboxChange = (ingredient, e) => {
    if (e.target.checked) {
      setCheckedIngredients([
        ...checkedIngredients,
        { ingredientId: ingredient._id, name: ingredient.name },
      ])
    } else {
      setCheckedIngredients(
        checkedIngredients.filter(
          (item) => item.ingredientId !== ingredient._id
        )
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
        <form onSubmit={handleSubmit}>
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
                            ingredients.map((ingredient) => {
                              return {
                                ingredientId: ingredient._id,
                                name: ingredient.name,
                              }
                            })
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
                    className={`hover ${checkedIngredients.some((item) => item.ingredientId === ingredient._id) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleRowClick(ingredient)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedIngredients.some(
                          (item) => item.ingredientId === ingredient._id
                        )}
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
            <button
              type="button"
              className="btn rounded-xl px-8"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
            >
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

export default ChooseIngredientsModal
