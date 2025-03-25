import { RiCloseLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import axios from 'axios'

function AddNutrientModal({ user_id, isOpen, onClose, onResult }) {
  const [formData, setFormData] = useState({
    abbreviation: '',
    name: '',
    unit: '',
    group: '',
    description: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const body = { ...formData, source: 'user', user: user_id }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/nutrient`,
        body
      )
      const nutrientData = res.data.nutrients
      const messageData = res.data.message
      onResult(
        nutrientData,
        messageData,
        messageData === 'success'
          ? 'Successfully updated nutrient'
          : 'Failed to update nutrient'
      )
      // reset form data
      setFormData({
        abbreviation: '',
        name: '',
        unit: '',
        group: '',
        description: '',
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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

        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Abbreviation</span>
              </label>
              <input
                type="text"
                name="abbreviation"
                value={formData.abbreviation}
                required
                onChange={handleChange}
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
                <span className="label-text">Unit</span>
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                required
                onChange={handleChange}
                placeholder="Enter unit"
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Group</span>
              </label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="" disabled>
                  Select group
                </option>
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
            <button
              type="button"
              className="btn rounded-xl px-8"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-green-button rounded-xl px-8 text-white hover:bg-green-600"
            >
              Add
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

export default AddNutrientModal
