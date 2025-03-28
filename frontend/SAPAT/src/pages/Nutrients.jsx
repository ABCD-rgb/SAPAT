import { useState, useEffect } from 'react'
import {
  RiAddLine,
  RiFileUploadLine,
  RiFileDownloadLine,
  RiFilterLine,
} from 'react-icons/ri'
import AddNutrientModal from '../components/modals/nutrients/AddNutrientModal'
import EditNutrientModal from '../components/modals/nutrients/EditNutrientModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'
import Loading from '../components/Loading.jsx'
import useAuth from '../hook/useAuth.js'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Toast from '../components/Toast.jsx'

function Nutrients() {
  const { user, loading } = useAuth()
  const [nutrients, setNutrients] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedNutrient, setSelectedNutrient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/nutrient/filtered/${user._id}`
      )
      const fetchedData = res.data.nutrients
      setNutrients(fetchedData)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditClick = (nutrient) => {
    setSelectedNutrient(nutrient)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (nutrient) => {
    setSelectedNutrient(nutrient)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const selectedId = selectedNutrient._id
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/nutrient/${selectedNutrient._id}/${user._id}`
      )
      const messageData = res.data.message
      if (messageData === 'success') {
        setNutrients(
          nutrients.filter((nutrient) => nutrient._id !== selectedId)
        )
      }
      // toast instructions
      setShowToast(true)
      setMessage(
        messageData === 'success'
          ? 'Nutrient deleted successfully'
          : 'Failed to delete nutrient.'
      )
      setToastAction(messageData)
    } catch (err) {
      console.log(err)
      setShowToast(true)
      setMessage('Failed to delete formulation.')
      setToastAction('error')
    }
  }

  const handleCreateResult = (newNutrient, action, message) => {
    setIsAddModalOpen(false)
    setNutrients([...nutrients, newNutrient])
    // toast instructions
    setShowToast(true)
    setMessage(message)
    setToastAction(action)
  }

  const handleEditResult = (updatedNutrient, action, message) => {
    setIsEditModalOpen(false)
    setNutrients((prevNutrient) => {
      const index = prevNutrient.findIndex(
        (nutrient) => nutrient._id === updatedNutrient._id
      )
      const updated = [...prevNutrient]
      updated[index] = { ...updatedNutrient }
      return updated
    })
    // toast instructions
    setShowToast(true)
    setMessage(message)
    setToastAction(action)
  }

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

  const headers = ['Abbreviation', 'Name', 'Unit', 'Description', 'Group']

  if (loading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/" />
  }
  // loading due to api calls
  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex h-auto flex-col bg-gray-50">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10 space-y-6 bg-gray-50 p-3 md:p-6">
        <h1 className="text-deepbrown mb-6 text-xl font-bold md:text-2xl">
          Nutrients
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
          data={nutrients}
          page="nutrients"
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Modals */}
      <AddNutrientModal
        user_id={user._id}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onResult={handleCreateResult}
      />
      <EditNutrientModal
        user_id={user._id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        nutrient={selectedNutrient}
        onResult={handleEditResult}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Nutrient"
        description={`Are you sure you want to delete ${selectedNutrient?.name}? This action cannot be undone.`}
        type="delete"
      />

      {/*  Toasts */}
      <Toast
        className="transition delay-150 ease-in-out"
        show={showToast}
        action={toastAction}
        message={message}
        onHide={hideToast}
      />
    </div>
  )
}

export default Nutrients
