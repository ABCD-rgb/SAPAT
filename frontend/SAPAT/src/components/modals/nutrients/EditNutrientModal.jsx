import { RiCloseLine } from 'react-icons/ri'

function EditNutrientModal({ isOpen, onClose, nutrient }) {
  return (
    <dialog
      id="edit_nutrient_modal"
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

        <h3 className="text-deepbrown mb-4 text-lg font-bold">Edit Nutrient</h3>

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
              defaultValue={nutrient?.abbreviation}
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
              defaultValue={nutrient?.name}
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
              defaultValue={nutrient?.unit}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Group</span>
            </label>
            <select
              className="select select-bordered w-full rounded-xl"
              defaultValue={nutrient?.group}
            >
              <option disabled>Select group</option>
              <option>Composition</option>
              <option>Amino acids</option>
              <option>Minerals</option>
              <option>Vitamins</option>
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
              defaultValue={nutrient?.description}
            ></textarea>
          </div>
        </div>

        {/* Modal actions */}
        <div className="modal-action">
          <button className="btn rounded-xl px-8" onClick={onClose}>
            Cancel
          </button>
          <button className="btn rounded-xl bg-amber-500 px-8 text-white hover:bg-amber-600">
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

export default EditNutrientModal
