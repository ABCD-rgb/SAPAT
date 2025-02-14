import { useState } from 'react'
import { RiAddLine, RiFileUploadLine, RiFileDownloadLine, RiFilterLine } from 'react-icons/ri'
import AddNutrientModal from '../components/modals/nutrients/AddNutrientModal'
import EditNutrientModal from '../components/modals/nutrients/EditNutrientModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'

function Nutrients() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedNutrient, setSelectedNutrient] = useState(null)

  const nutrients = [
    { abbreviation: 'DM', name: 'Dry Matter', unit: '%', description: '', group: 'Composition' },
    { abbreviation: 'CP', name: 'Crude Protein', unit: '%', description: '', group: 'Composition' },
    { abbreviation: '', name: 'Lysine', unit: '%', description: '', group: 'Amino acids' },
    { abbreviation: '', name: 'Glycine', unit: '%', description: '', group: 'Amino acids' },
  ]

  const handleEditClick = (nutrient) => {
    setSelectedNutrient(nutrient)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (nutrient) => {
    setSelectedNutrient(nutrient)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    // TODO: Implement delete functionality
    console.log('Deleting nutrient:', selectedNutrient)
  }

  const headers = ['Abbreviation', 'Name', 'Unit', 'Description', 'Group']

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-full">
      <h1 className="text-xl md:text-2xl font-bold text-deepbrown mb-6">Nutrients</h1>

      {/* Action buttons and search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
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

      {/* Nutrients table */}
      <Table 
        headers={headers}
        data={nutrients}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <AddNutrientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <EditNutrientModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        nutrient={selectedNutrient}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Nutrient"
        description={`Are you sure you want to delete ${selectedNutrient?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default Nutrients
