import { RiCloseLine } from 'react-icons/ri'

function AddNutrientModal({ isOpen, onClose }) {
  return (
    <dialog id="add_nutrient_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-2xl bg-white rounded-3xl relative mt-[64px] md:mt-0">
        {/* Close button */}
        <button 
          className="btn btn-sm btn-circle absolute right-4 top-4"
          onClick={onClose}
        >
          <RiCloseLine className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-lg text-deepbrown mb-4">Add Nutrient</h3>
        
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <select className="select select-bordered w-full rounded-xl">
              <option disabled selected>Select group</option>
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
            ></textarea>
          </div>
        </div>

        {/* Modal actions */}
        <div className="modal-action">
          <button 
            className="btn rounded-xl px-8" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn bg-green-button hover:bg-green-600 text-white rounded-xl px-8">
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
