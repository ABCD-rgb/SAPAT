import { RiCloseLine } from 'react-icons/ri'
import { useEffect, useState, useMemo } from 'react'
import Loading from '../../Loading.jsx'
import axios from 'axios'

function EditIngredientModal({
  user_id,
  isOpen,
  onClose,
  ingredient,
  onResult,
}) {
  // const nutrientInputs = [
  //   { name: 'Dry Matter', unit: '%' },
  //   { name: 'Crude Protein', unit: '%' },
  //   { name: 'Lysine', unit: '%' },
  //   { name: 'Glycine', unit: '%' },
  // ]
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    group: '',
    nutrients: [
      {
        name: '',
        unit: '',
        value: 0,
      },
    ],
  })

  useEffect(() => {
    if (ingredient) {
      setFormData(ingredient)
      // update formData (get name and unit for each nutrient)
      fetchNutrientData(ingredient.nutrients)
    }
  }, [ingredient])

  const fetchNutrientData = async (nutrients) => {
    try {
      const formattedNutrients = await Promise.all(
        nutrients.map(async (nutrient) => {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/nutrient/${nutrient.nutrient}/${user_id}`
          )
          const fetchedData = res.data.nutrients
          return {
            nutrient: fetchedData._id,
            name: fetchedData.name,
            unit: fetchedData.unit,
            value: nutrient.value,
          }
        })
      )
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          nutrients: formattedNutrients,
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { _id, user, ...body } = formData
      const ingredient_id = ingredient.ingredient_id || ingredient._id
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/ingredient/${ingredient_id}/${user_id}`,
        body
      )
      const ingredientData = res.data.ingredients
      const messageData = res.data.message
      onResult(
        ingredientData,
        messageData,
        messageData === 'success'
          ? 'Successfully updated ingredient'
          : 'Failed to update ingredient'
      )
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

  const handleNutrientChange = (index, event) => {
    const { name, value } = event.target
    const updatedNutrients = formData.nutrients.map((nutrient, i) =>
      i === index ? { ...nutrient, [name]: value } : nutrient
    )
    setFormData((prev) => ({ ...prev, nutrients: updatedNutrients }))
  }

  const nutrientRows = useMemo(() => {
    return formData.nutrients.map((nutrient, index) => (
      <tr key={index}>
        <td>{nutrient.name}</td>
        <td>{nutrient.unit}</td>
        <td>
          <input
            type="number"
            name="value"
            placeholder="Value"
            className="input input-bordered input-sm w-full max-w-xs rounded-xl"
            value={nutrient.value}
            pattern="[0-9]*"
            onChange={(e) => handleNutrientChange(index, e)}
          />
        </td>
      </tr>
    ))
  }, [formData.nutrients])

  return (
    <dialog
      id="edit_ingredient_modal"
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
          Edit Ingredient
        </h3>
        <p className="mb-4 text-sm text-gray-500">Description</p>

        <form onSubmit={handleSubmit}>
          {/* Description section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                  className="input input-bordered w-full rounded-2xl"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Price (PHP/kg)</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  pattern="[0-9]*"
                  required
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="input input-bordered w-full rounded-2xl"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Available</span>
                </label>
                <select
                  name="available"
                  value={formData.available}
                  onChange={handleChange}
                  className="select select-bordered w-full rounded-2xl"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Group</span>
                </label>
                <select
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="select select-bordered w-full rounded-2xl"
                >
                  <option value="Cereal grains">Cereal grains</option>
                  <option value="Protein">Protein</option>
                  <option value="Fats and oils">Fats and oils</option>
                  <option value="Minerals and vitamins">
                    Minerals and vitamins
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Nutrients table */}
          <div className="max-h-64 overflow-y-auto rounded-2xl border border-gray-200">
            <table className="table-zebra table-pin-rows table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-semibold">Name</th>
                  <th className="font-semibold">Unit</th>
                  <th className="font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>{nutrientRows}</tbody>
            </table>
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

export default EditIngredientModal
