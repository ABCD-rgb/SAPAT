import { RiCloseLine } from 'react-icons/ri'

function AddNutrientModal({ isOpen, onClose }) {
  return (
    <dialog
      id="add_nutrient_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-2xl rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-4 text-lg font-bold">Add Nutrient</h3>

        {/* Form fields */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Abbreviation</span>
            </label>
            <input
              type="text"
              placeholder="Enter abbreviation"
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Unit</span>
            </label>
            <input
              type="text"
              placeholder="Enter unit"
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Group</span>
            </label>
            <select 
              className="select select-bordered w-full rounded-xl"
              defaultValue=""
            >
              <option value="" disabled>Select group</option>
              <option value="Energy">Energy</option>
              <option value="Composition">Composition</option>
              <option value="Minerals">Minerals</option>
              <option value="Amino acids">Amino acids</option>
            </select>
          </div>

          <div className="form-control w-full md:col-span-2">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Enter description"
              className="textarea textarea-bordered w-full rounded-xl"
              rows="3"
            ></textarea>
          </div>
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

export default AddNutrientModal
