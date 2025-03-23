import { RiCloseLine } from 'react-icons/ri'

function ChooseIngredientsModal({ isOpen, onClose, ingredients }) {
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
        <div className="max-h-64 overflow-y-auto overflow-hidden rounded-2xl border border-gray-200">
          <table className="table-zebra table table-pin-rows">
            <thead className="bg-gray-50">
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th className="font-semibold">Name</th>
              <th className="font-semibold">Price</th>
              <th className="font-semibold">Available</th>
              <th className="font-semibold">Group</th>
            </tr>
            </thead>
            <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
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