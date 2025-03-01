import {
  RiAddLine,
  RiFileDownloadLine,
  RiFileUploadLine,
  RiFilterLine,
} from 'react-icons/ri'
import { useState } from 'react'
import AddIngredientModal from '../components/modals/ingredients/AddIngredientModal'
import EditIngredientModal from '../components/modals/ingredients/EditIngredientModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'
import Loading from '../components/Loading'
import useAuth from "../hook/useAuth.js";
import {Navigate} from "react-router-dom";

function Ingredients() {
  const { user, loading } = useAuth()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState(null)


  const ingredients = [
    { name: 'Barley', price: '6.50', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    { name: 'Maize', price: '54.30', available: 'Yes', group: 'Cereals' },
    {
      name: 'Wheat, Starch',
      price: '5.15',
      available: 'Yes',
      group: 'Wheat by-products',
    },
  ]

  const handleEditClick = (ingredient) => {
    setSelectedIngredient(ingredient)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (ingredient) => {
    setSelectedIngredient(ingredient)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    // TODO: Implement delete functionality
    console.log('Deleting ingredient:', selectedIngredient)
  }

  const headers = ['Name', 'Price (PHP/kg)', 'Available', 'Group']

  if (loading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10 space-y-6 bg-gray-50 p-3 md:p-6">
        <h1 className="text-deepbrown mb-6 text-xl font-bold md:text-2xl">
          Ingredients
        </h1>

        {/* Action buttons and search */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-button flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700 md:gap-2 md:px-4 md:py-2 md:text-base"
            >
              <RiAddLine className="h-4 w-4 md:h-5 md:w-5" />
              <span>Add New</span>
            </button>
            <button className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex items-center gap-1 rounded-lg border px-2 py-1 text-sm transition-colors hover:text-white md:gap-2 md:px-4 md:py-2 md:text-base">
              <RiFileUploadLine className="h-4 w-4 md:h-5 md:w-5" />
              <span>Import</span>
            </button>
            <button className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex items-center gap-1 rounded-lg border px-2 py-1 text-sm transition-colors hover:text-white md:gap-2 md:px-4 md:py-2 md:text-base">
              <RiFileDownloadLine className="h-4 w-4 md:h-5 md:w-5" />
              <span>Export</span>
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

      {/* Table Section - Removed overflow from container */}
      <div className="flex-1 p-3 md:px-6">
        <Table
          headers={headers}
          data={ingredients}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <AddIngredientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditIngredientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ingredient={selectedIngredient}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Ingredient"
        description={`Are you sure you want to delete ${selectedIngredient?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

export default Ingredients
