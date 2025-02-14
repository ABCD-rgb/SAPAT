import { RiCloseLine } from 'react-icons/ri'

function AddIngredientModal({ isOpen, onClose }) {
  const nutrientInputs = [
    { name: 'Dry Matter', unit: '%' },
    { name: 'Crude Protein', unit: '%' },
    { name: 'Lysine', unit: '%' },
    { name: 'Glycine', unit: '%' },
  ]

  return (
    <dialog
      id="add_ingredient_modal"
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
          Add Ingredient
        </h3>
        <p className="mb-4 text-sm text-gray-500">Description</p>

        {/* Description section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Value"
                className="input input-bordered w-full rounded-2xl"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price (PHP/kg)</span>
              </label>
              <input
                type="text"
                placeholder="Value"
                className="input input-bordered w-full rounded-2xl"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Group</span>
              </label>
              <select className="select select-bordered w-full rounded-2xl">
                <option disabled selected>
                  Value
                </option>
                <option>Cereals</option>
                <option>Wheat by-products</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nutrients table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="table-zebra table">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Unit</th>
                <th className="font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {nutrientInputs.map((nutrient, index) => (
                <tr key={index}>
                  <td>{nutrient.name}</td>
                  <td>{nutrient.unit}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Value"
                      className="input input-bordered input-sm w-full max-w-xs rounded-xl"
                    />
                  </td>
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

export default AddIngredientModal
