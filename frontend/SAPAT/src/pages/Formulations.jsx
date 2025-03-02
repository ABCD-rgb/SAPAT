import { RiAddLine, RiFilterLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import CreateFormulationModal from '../components/modals/formulations/CreateFormulationModal'
import EditFormulationModal from '../components/modals/formulations/EditFormulationModal'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import Table from '../components/Table'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import {Navigate, useNavigate} from 'react-router-dom'
import useAuth from "../hook/useAuth.js";
import axios from "axios";

function Formulations() {
  const { user, loading } = useAuth()

  const [formulations, setFormulations] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false)
  const [selectedFormulation, setSelectedFormulation] = useState(null)
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')
  const navigateURL = useNavigate()

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/formulation/filtered/${user._id}`);
      const fetchedData = res.data.formulations;
      setFormulations(fetchedData);
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditClick = (formulation) => {
    setSelectedFormulation(formulation)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (formulation) => {
    setSelectedFormulation(formulation)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const selectedId = selectedFormulation._id;
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/formulation/${selectedFormulation._id}`);
      const messageData = res.data.message;
      if (messageData === 'success') {
        setFormulations(formulations.filter((formulation) => formulation._id !== selectedId))
      }
      // toast instructions
      setShowToast(true)
      setMessage(messageData === 'success' ? 'Formulation deleted successfully' : 'Failed to delete formulation.')
      setToastAction(messageData)
    } catch (err) {
      console.log(err)
      setShowToast(true)
      setMessage('Failed to delete formulation.')
      setToastAction('error')
    }
    console.log('Deleting formulation:', selectedFormulation)
  }

  const handleCreateResult = (newFormulation, action, message) => {
    setIsCreateModalOpen(false)
    setFormulations([...formulations, newFormulation])
    // toast instructions
    setShowToast(true)
    setMessage(message)
    setToastAction(action)
  }

  const handleEditResult = (updatedFormulation, action, message) => {
    setIsEditModalOpen(false)
    setFormulations((prevFormulations) => {
      const index = prevFormulations.findIndex((formulation) => formulation._id === updatedFormulation._id)
      const updated = [...prevFormulations]
      const formulationAccess = updated[index].access
      updated[index] = {...updatedFormulation, access: formulationAccess};
      return updated;
    })
    // toast instructions
    setShowToast(true)
    setMessage(message)
    setToastAction(action)
  }

  const handleRowClick = (formulation) => {
    navigateURL(`/formulations/${formulation._id}`)
  }

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

  const headers = ['Code', 'Name', 'Description', 'Animal Group', 'Access']

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
          page="formulations"
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Modals */}
      <CreateFormulationModal
        owner={user._id}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onResult={handleCreateResult}
      />
      <EditFormulationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formulation={selectedFormulation}
        onResult={handleEditResult}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Formulation"
        description={`Are you sure you want to delete ${selectedFormulation?.name}? This action cannot be undone.`}
        type='delete'
      />

      {/*  Toasts */}
      <Toast
        className="transition ease-in-out delay-150"
        show={showToast}
        action={toastAction}
        message={message}
        onHide={hideToast}
      />

    </div>
  )
}

export default Formulations
