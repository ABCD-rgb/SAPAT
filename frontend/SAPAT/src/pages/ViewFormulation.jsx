import {Navigate, useParams} from 'react-router-dom'
import {
  RiShareLine,
  RiAddLine,
  RiCalculatorLine,
  RiFileChartLine,
  RiFileUploadLine,
  RiFileDownloadLine,
} from 'react-icons/ri'
import { useState, useEffect } from 'react'
import useAuth from "../hook/useAuth.js";
import axios from 'axios';

function ViewFormulation() {
  const { id } = useParams()
  const { user, loading } = useAuth()


  const [formulation, setFormulation] = useState({
    code: '',
    name: '',
    description: '',
    animal_group: '',
    ingredients: [],
    nutrients: [],
  });
  const [focusedInput, setFocusedInput] = useState(null)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/formulation/${id}`);
      setFormulation(res.data.formulations);
    } catch (err) {
      console.log(err);
    } finally {
      // TODO: add loading screen
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulation({
      ...formulation,
      [name]: value,
    });
  }

  const handleFocus = (inputId) => {
    setFocusedInput(inputId)
  }

  const handleBlur = () => {
    setFocusedInput(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {/* Header - Adjusted for mobile */}
          <h1 className="text-deepbrown mb-6 text-xl font-bold md:text-2xl">
            View Formulation
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors hover:text-white">
                <RiFileUploadLine className="h-4 w-4 md:h-5 md:w-5" />
                <span>Import</span>
              </button>
              <button className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors hover:text-white">
                <RiFileDownloadLine className="h-4 w-4 md:h-5 md:w-5" />
                <span>Export</span>
              </button>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <div className="h-6 w-6 rounded-full bg-blue-400 sm:h-8 sm:w-8"></div>
                <div className="h-6 w-6 rounded-full bg-green-400 sm:h-8 sm:w-8"></div>
                <div className="h-6 w-6 rounded-full bg-yellow-400 sm:h-8 sm:w-8"></div>
              </div>
              <button className="btn btn-sm gap-1 rounded-lg text-xs">
                <RiShareLine /> Share ▼
              </button>
            </div>
          </div>

          {/* Form Fields - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="label text-sm font-medium">Code</label>
              <input
                type="text"
                name="code"
                value={formulation.code}
                className="input input-bordered w-full rounded-xl"
                onChange={handleChange}
                onFocus={() => handleFocus('code')}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="label text-sm font-medium">
                Formulation name
              </label>
              <input
                type="text"
                name="name"
                value={formulation.name}
                className="input input-bordered w-full rounded-xl"
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label text-sm font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={formulation.description}
                className="input input-bordered w-full rounded-xl"
                onFocus={() => handleFocus('description')}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label text-sm font-medium">Animal group</label>
              <select
                className="select select-bordered w-full rounded-xl"
                name="animal_group"
                value={formulation.animal_group}
                onChange={handleChange}
                onFocus={() => handleFocus('animalGroup')}
                onBlur={handleBlur}
              >
                <option>Broiler</option>
                <option>Layer</option>
                <option>Swine</option>
                <option>Poultry</option>
              </select>
            </div>
          </div>

          {/* Tables - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Ingredients Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="p-4">
                <h3 className="mb-2 text-sm font-semibold">Ingredients</h3>
                <p className="text-xs text-gray-500">description</p>
              </div>
              <div className="overflow-x-auto">
                <table className="table-sm table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Minimum</th>
                      <th>Maximum</th>
                      <th>Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulation.ingredients.map((ingredient, index) => (
                      <tr key={index}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.minimum}</td>
                        <td>{ingredient.maximum}</td>
                        <td>{ingredient.value}</td>
                        <td>
                          <button className="btn btn-ghost btn-xs">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <button className="bg-green-button flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700">
                  <RiAddLine /> Add ingredient
                </button>
              </div>
            </div>

            {/* Nutrients Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="p-4">
                <h3 className="mb-2 text-sm font-semibold">Nutrients</h3>
                <p className="text-xs text-gray-500">description</p>
              </div>
              <div className="overflow-x-auto">
                <table className="table-sm table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Minimum</th>
                      <th>Maximum</th>
                      <th>Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulation.nutrients.map((nutrient, index) => (
                      <tr key={index}>
                        <td>{nutrient.name}</td>
                        <td>{nutrient.minimum}</td>
                        <td>{nutrient.maximum}</td>
                        <td>{nutrient.value}</td>
                        <td>
                          <button className="btn btn-ghost btn-xs">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <button className="bg-green-button flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700">
                  <RiAddLine /> Add nutrient
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-500">Total cost (per kg)</span>
              <input
                type="number"
                className="input input-bordered input-sm w-24 rounded-lg"
                onFocus={() => handleFocus('total-cost')}
                onBlur={handleBlur}
              />
            </div>
            <button className="btn btn-primary gap-2 rounded-lg">
              <RiCalculatorLine /> Optimize
            </button>
            <button className="btn btn-warning gap-2 rounded-lg">
              <RiFileChartLine /> Generate report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFormulation
