import { RiAddLine, RiFilterLine } from 'react-icons/ri'
import { useState } from 'react'
import CreateFormulationModal from '../components/modals/formulations/CreateFormulationModal'
import EditFormulationModal from '../components/modals/formulations/EditFormulationModal'
import FormulationCreatedModal from '../components/modals/formulations/FormulationCreatedModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'
import { useNavigate } from 'react-router-dom'

function Formulations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false)
  const [selectedFormulation, setSelectedFormulation] = useState(null)
  const navigate = useNavigate()
  
  const formulations = [
    { code: 'F1', name: 'Feed 1', description: '', animalGroup: 'Swine' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
  ]

  const handleEditClick = (formulation) => {
    setSelectedFormulation(formulation)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (formulation) => {
    setSelectedFormulation(formulation)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    // TODO: Implement delete functionality
    console.log('Deleting formulation:', selectedFormulation)
  }

  const handleCreateSuccess = (newFormulation) => {
    setIsCreateModalOpen(false)
    setSelectedFormulation(newFormulation)
    setIsCreatedModalOpen(true)
  }

  const handleRowClick = (formulation) => {
    navigate(`/formulations/${formulation.code}`)
  }

  const headers = ['Code', 'Name', 'Description', 'Animal Group']

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-full">
      <h1 className="text-xl md:text-2xl font-bold text-deepbrown mb-6">Formulations</h1>

      {/* Action buttons and search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-button hover:bg-green-600 active:bg-green-700 transition-colors text-white px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded-lg flex items-center gap-1 md:gap-2"
          >
            <RiAddLine className="w-4 h-4 md:w-5 md:h-5" />
            <span>Add New</span>
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

      {/* Formulations table */}
      <Table 
        headers={headers}
        data={formulations}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onRowClick={handleRowClick}
      />

      <CreateFormulationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <EditFormulationModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formulation={selectedFormulation}
      />
      <FormulationCreatedModal
        isOpen={isCreatedModalOpen}
        onClose={() => setIsCreatedModalOpen(false)}
        formulation={selectedFormulation}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Formulation"
        description={`Are you sure you want to delete ${selectedFormulation?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default Formulations
