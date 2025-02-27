import { RiAddLine, RiFilterLine } from 'react-icons/ri'
import { useState } from 'react'
import CreateFormulationModal from '../components/modals/formulations/CreateFormulationModal'
import EditFormulationModal from '../components/modals/formulations/EditFormulationModal'
import FormulationCreatedModal from '../components/modals/formulations/FormulationCreatedModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'
import {Navigate, useNavigate} from 'react-router-dom'
import useAuth from "../hook/useAuth.js";

function Formulations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false)
  const [selectedFormulation, setSelectedFormulation] = useState(null)
  const navigateURL = useNavigate()

  const { user, loading } = useAuth()
  if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <Navigate to="/" />
  }

  const formulations = [
    { code: 'F1', name: 'Feed 1', description: '', animalGroup: 'Swine' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
    { code: 'F2', name: 'My Feed 1', description: '', animalGroup: 'Pig' },
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
    navigateURL(`/formulations/${formulation.code}`)
  }

  const headers = ['Code', 'Name', 'Description', 'Animal Group']

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10 space-y-6 bg-gray-50 p-3 md:p-6">
        <h1 className="text-deepbrown mb-6 text-xl font-bold md:text-2xl">
          Formulations
        </h1>

        {/* Action buttons and search */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-button flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700 md:gap-2 md:px-4 md:py-2 md:text-base"
            >
              <RiAddLine className="h-4 w-4 md:h-5 md:w-5" />
              <span>Add New</span>
            </button>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none md:px-4 md:py-2 md:text-base"
            />
            <button className="text-darkbrown hover:border-deepbrown flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm whitespace-nowrap transition-colors hover:bg-gray-50 active:bg-gray-100 md:gap-2 md:px-4 md:py-2 md:text-base">
              <RiFilterLine className="h-4 w-4 md:h-5 md:w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 p-3 md:px-6">
        <Table
          headers={headers}
          data={formulations}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Modals */}
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
