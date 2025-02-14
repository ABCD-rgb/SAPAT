import { useParams } from 'react-router-dom'
import { RiShareLine, RiAddLine, RiCalculatorLine, RiFileChartLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'

// Define the hook directly in the same file
function useUserColor() {
  const [userColor, setUserColor] = useState('')
  
  const colors = [
    '#FF6B6B', // red
    '#4ECDC4', // teal
    '#45B7D1', // blue
    '#96CEB4', // green
    '#FFEEAD', // yellow
    '#D4A5A5', // pink
    '#9B59B6', // purple
    '#E67E22', // orange
  ]

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setUserColor(randomColor)
  }, [])

  return userColor
}

function ViewFormulation() {
  const { code } = useParams()
  const userColor = useUserColor()
  const [focusedInput, setFocusedInput] = useState(null)

  const handleFocus = (inputId) => {
    setFocusedInput(inputId)
  }

  const handleBlur = () => {
    setFocusedInput(null)
  }

  const getInputStyle = (inputId) => ({
    borderColor: focusedInput === inputId ? userColor : '',
    boxShadow: focusedInput === inputId ? `0 0 0 1px ${userColor}` : '',
  })

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {/* Header - Adjusted for mobile */}
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
            <div className="flex gap-2 flex-wrap">
              <button className="btn btn-sm btn-outline text-xs">Import</button>
              <button className="btn btn-sm btn-outline text-xs">Export</button>
            </div>
            <div className="flex gap-1 items-center">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-400"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-400"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400"></div>
              </div>
              <button className="btn btn-sm text-xs gap-1">
                <RiShareLine /> Share ▼
              </button>
            </div>
          </div>

          {/* Form Fields - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label text-sm font-medium">Code</label>
              <input 
                type="text" 
                value={code}
                readOnly
                className="input input-bordered w-full rounded-xl" 
                style={getInputStyle('code')}
                onFocus={() => handleFocus('code')}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="label text-sm font-medium">Formulation name</label>
              <input 
                type="text"
                className="input input-bordered w-full rounded-xl" 
                style={getInputStyle('name')}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label text-sm font-medium">Description</label>
              <input 
                type="text"
                className="input input-bordered w-full rounded-xl" 
                style={getInputStyle('description')}
                onFocus={() => handleFocus('description')}
                onBlur={handleBlur}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label text-sm font-medium">Animal group</label>
              <select 
                className="select select-bordered w-full rounded-xl"
                style={getInputStyle('animalGroup')}
                onFocus={() => handleFocus('animalGroup')}
                onBlur={handleBlur}
              >
                <option>Broiler</option>
                <option>Layer</option>
                <option>Swine</option>
              </select>
            </div>
          </div>

          {/* Tables - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ingredients Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">Ingredients</h3>
                <p className="text-xs text-gray-500">description</p>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
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
                    <tr>
                      <td>Maize</td>
                      <td>1.2</td>
                      <td>4.0</td>
                      <td></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">×</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Barley</td>
                      <td>
                        <input 
                          type="number"
                          className="input input-bordered input-sm w-20"
                          style={getInputStyle('barley-min')}
                          onFocus={() => handleFocus('barley-min')}
                          onBlur={handleBlur}
                        />
                      </td>
                      <td>
                        <input 
                          type="number"
                          className="input input-bordered input-sm w-20"
                          style={getInputStyle('barley-max')}
                          onFocus={() => handleFocus('barley-max')}
                          onBlur={handleBlur}
                        />
                      </td>
                      <td></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">×</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <button className="btn btn-sm gap-2 bg-green-600 text-white">
                  <RiAddLine /> Add ingredient
                </button>
              </div>
            </div>

            {/* Nutrients Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">Nutrients</h3>
                <p className="text-xs text-gray-500">description</p>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
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
                    <tr>
                      <td>DM</td>
                      <td>12.8</td>
                      <td></td>
                      <td></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">×</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 space-y-4">
                <button className="btn btn-sm gap-2 bg-green-600 text-white">
                  <RiAddLine /> Add nutrient
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total cost (per kg)</span>
                  <input 
                    type="number"
                    className="input input-bordered input-sm w-24 rounded-lg"
                    style={getInputStyle('total-cost')}
                    onFocus={() => handleFocus('total-cost')}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button className="btn btn-primary gap-2">
              <RiCalculatorLine /> Optimize
            </button>
            <button className="btn btn-warning gap-2">
              <RiFileChartLine /> Generate report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFormulation
