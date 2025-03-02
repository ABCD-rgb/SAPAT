import { RiCloseLine } from 'react-icons/ri'
import {useEffect, useState} from "react";
import axios from "axios";

function EditFormulationModal({ isOpen, onClose, formulation, onResult }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    animal_group: '',
    description: ''
  });

  useEffect(() => {
    if (formulation) {
      setFormData(formulation);
    }
  }, [formulation]);



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { _id, ...body } = formData;
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/formulation/${_id}`, body)
      const formulationData = res.data.formulations;
      const messageData = res.data.message;
      onResult(
        formulationData,
        messageData,
        messageData === 'success' ? "Successfully updated formulation." : "Failed to update formulation."
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <dialog
      id="edit_formulation_modal"
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

        <h3 className="text-deepbrown mb-4 text-lg font-bold">
          Edit Formulation
        </h3>

        {/* Form fields */}
        <form onSubmit={handleSubmit}>
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
            <button type="button" className="btn rounded-xl px-8" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn rounded-xl bg-amber-500 px-8 text-white hover:bg-amber-600"
            >
              Update
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

export default EditFormulationModal
