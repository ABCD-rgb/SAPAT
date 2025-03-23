import { RiCloseLine } from 'react-icons/ri'

function ChooseNutrientsModal({ isOpen, onClose }) {
  const nutrientInputs = [
    { abbreviation: 'DM', name: 'Dry Matter', unit: '%', group: 'Composition' },
    { abbreviation: 'CP', name: 'Crude Protein', unit: '%', group: 'Composition' },
    { abbreviation: '', name: 'Lysine', unit: '%', group: 'Amino Acids' },
    { abbreviation: '', name: 'Glycine', unit: '%', group: 'Amino Acids' },
  ]

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

        {/* Description section */}

        {/* Nutrients table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="table-zebra table">
            <thead className="bg-gray-50">
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th className="font-semibold">Abbreviation</th>
              <th className="font-semibold">Name</th>
              <th className="font-semibold">Unit</th>
              <th className="font-semibold">Group</th>
            </tr>
            </thead>
            <tbody>
            {nutrientInputs.map((nutrient, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ChooseNutrientsModal