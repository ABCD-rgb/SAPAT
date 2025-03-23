import { RiCloseLine } from 'react-icons/ri'

function ChooseIngredientsModal({ isOpen, onClose }) {
  const nutrientInputs = [
    { name: 'Dry Matter', price: '32.11', available: 1, group: 'Composition' },
    { name: 'Crude Protein', price: '12.21', available: 1, group: 'Composition' },
    { name: 'Lysine', price: '13.26', available: 1, group: 'Energy' },
    { name: 'Glycine', price: '10.22', available: 1, group: 'Composition' },
  ]

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

        {/* Description section */}

        {/* Nutrients table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="table-zebra table">
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
            {nutrientInputs.map((nutrient, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{nutrient.name}</td>
                <td>{nutrient.price}</td>
                <td>{nutrient.available}</td>
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ChooseIngredientsModal