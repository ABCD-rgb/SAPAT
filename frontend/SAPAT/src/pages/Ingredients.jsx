import { RiAddLine, RiFileDownloadLine, RiFileUploadLine, RiFilterLine, RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'
import { useState } from 'react'
import AddIngredientModal from '../components/ingredients/AddIngredientModal'

function Ingredients() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const ingredients = [
    { name: 'Barley', price: '6.50', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Wheat, Starch', price: '5.15', available: 'Yes', group: 'Wheat by-products' },
  ]

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-full">
      <h1 className="text-xl md:text-2xl font-bold text-deepbrown mb-6">Ingredients</h1>

      {/* Action buttons and search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-button hover:bg-green-600 active:bg-green-700 transition-colors text-white px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded-lg flex items-center gap-1 md:gap-2"
          >
            <RiAddLine className="w-4 h-4 md:w-5 md:h-5" />
            <span>Add New</span>
          </button>
          <button className="border border-deepbrown text-deepbrown hover:bg-deepbrown hover:text-white active:bg-deepbrown/80 transition-colors px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded-lg flex items-center gap-1 md:gap-2">
            <RiFileUploadLine className="w-4 h-4 md:w-5 md:h-5" />
            <span>Import</span>
          </button>
          <button className="border border-deepbrown text-deepbrown hover:bg-deepbrown hover:text-white active:bg-deepbrown/80 transition-colors px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded-lg flex items-center gap-1 md:gap-2">
            <RiFileDownloadLine className="w-4 h-4 md:w-5 md:h-5" />
            <span>Export</span>
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
          />
          <button className="px-3 md:px-4 py-1 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg text-darkbrown whitespace-nowrap hover:border-deepbrown hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-1 md:gap-2">
            <RiFilterLine className="w-4 h-4 md:w-5 md:h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Ingredients table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-deepbrown">Name</th>
                <th className="text-deepbrown">Price (PHP/kg)</th>
                <th className="text-deepbrown">Available</th>
                <th className="text-deepbrown">Group</th>
                <th className="text-right text-deepbrown">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index} className="hover">
                  <td>{ingredient.name}</td>
                  <td>{ingredient.price}</td>
                  <td>{ingredient.available}</td>
                  <td>{ingredient.group}</td>
                  <td className="flex justify-end gap-2">
                    <button className="btn btn-ghost btn-sm text-deepbrown hover:bg-deepbrown/10">
                      <RiPencilLine className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
                      <RiDeleteBinLine className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddIngredientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default Ingredients
