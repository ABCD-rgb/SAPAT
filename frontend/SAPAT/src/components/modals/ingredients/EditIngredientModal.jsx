import { RiCloseLine } from 'react-icons/ri'

function EditIngredientModal({ isOpen, onClose, ingredient }) {
  const nutrientInputs = [
    { name: 'Dry Matter', unit: '%' },
    { name: 'Crude Protein', unit: '%' },
    { name: 'Lysine', unit: '%' },
    { name: 'Glycine', unit: '%' },
  ]

  return (
    <dialog id="edit_ingredient_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-3xl bg-white rounded-3xl relative mt-[64px] md:mt-0">
        {/* Close button */}
        <button 
          className="btn btn-sm btn-circle absolute right-4 top-4"
          onClick={onClose}
        >
          <RiCloseLine className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-lg text-deepbrown mb-4">Edit Ingredient</h3>
        <p className="text-sm text-gray-500 mb-4">Description</p>
        
        {/* Description section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text" 
                defaultValue={ingredient?.name} 
                className="input input-bordered w-full rounded-2xl" 
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price (PHP/kg)</span>
              </label>
              <input 
                type="text" 
                defaultValue={ingredient?.price} 
                className="input input-bordered w-full rounded-2xl" 
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Group</span>
              </label>
              <select 
                className="select select-bordered w-full rounded-2xl"
                defaultValue={ingredient?.group}
              >
                <option>Cereals</option>
                <option>Wheat by-products</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nutrients table */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <table className="table table-zebra">
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
          <button 
            className="btn rounded-xl px-8" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-8">
            Update
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default EditIngredientModal
