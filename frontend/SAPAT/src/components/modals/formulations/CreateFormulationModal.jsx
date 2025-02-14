import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'

function CreateFormulationModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    animalGroup: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add validation
    onSuccess(formData)
    // Reset form
    setFormData({
      code: '',
      name: '',
      description: '',
      animalGroup: ''
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <dialog id="create_formulation_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-2xl bg-white rounded-3xl relative mt-[64px] md:mt-0">
        {/* Close button */}
        <button 
          className="btn btn-sm btn-circle absolute right-4 top-4"
          onClick={onClose}
        >
          <RiCloseLine className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-lg text-deepbrown mb-4">Create Formulation</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input 
                type="text" 
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter code" 
                className="input input-bordered w-full rounded-xl" 
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name" 
                className="input input-bordered w-full rounded-xl" 
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Animal Group</span>
              </label>
              <select 
                name="animalGroup"
                value={formData.animalGroup}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="" disabled>Select group</option>
                <option value="Swine">Swine</option>
                <option value="Pig">Pig</option>
                <option value="Poultry">Poultry</option>
              </select>
            </div>

            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description" 
                className="textarea textarea-bordered w-full rounded-xl"
                rows="3"
              ></textarea>
            </div>
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
              className="btn bg-green-button hover:bg-green-600 text-white rounded-xl px-8"
            >
              Create
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

export default CreateFormulationModal
