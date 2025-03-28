import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'
import axios from 'axios'

function CreateFormulationModal({ owner, isOpen, onClose, onResult }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    animal_group: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = { ...formData, owner }
    console.log('body:', body)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/formulation`,
        body
      )
      console.log('res:', res)
      const newFormulation = res.data.formulations
      newFormulation.access = 'owner'
      onResult(newFormulation, 'success', 'Successfully created formulation.')
      // Reset form
      setFormData({
        code: '',
        name: '',
        description: '',
        animal_group: '',
      })
    } catch (err) {
      console.log(err)
      onResult(null, 'error', 'Failed to create formulation.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClose = () => {
    onClose()
    setFormData({
      code: '',
      name: '',
      description: '',
      animal_group: '',
    })
  }

  return (
    <dialog
      id="create_formulation_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-2xl rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={handleClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-4 text-lg font-bold">
          Create Formulation
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                required
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
                required
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
                name="animal_group"
                value={formData.animal_group}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="" disabled>
                  Select group
                </option>
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
                maxLength="60"
              ></textarea>
            </div>
          </div>

          {/* Modal actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn rounded-xl px-8"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  )
}

export default CreateFormulationModal
