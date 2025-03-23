import {
  RiShareLine,
  RiAddLine,
  RiCalculatorLine,
  RiFileChartLine,
  RiFileUploadLine,
  RiFileDownloadLine,
} from 'react-icons/ri'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Loading from "../../components/Loading.jsx";
import ShareFormulationModal from "../../components/modals/formulations/ShareFormulationModal.jsx";
import ConfirmationModal from "../../components/modals/ConfirmationModal.jsx";
import Toast from "../../components/Toast.jsx";
import Avatar from "../../components/Avatar.jsx";
import Selection from "../../components/Selection.jsx";
import ChooseIngredientsModal from "../../components/modals/viewformulation/ChooseIngredientsModal.jsx";
import ChooseNutrientsModal from "../../components/modals/viewformulation/ChooseNutrientsModal.jsx";
const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

function ViewFormulation({
  formulation,
  userAccess,
  id,
  user,
  self,
  others,
  updateMyPresence,
  formulationRealTime,
  updateCode,
  updateName,
  updateDescription,
  updateAnimalGroup,
}) {
  const VITE_API_URL = import.meta.env.VITE_API_URL;



  const [collaborators, setCollaborators] = useState([])
  const [newCollaborator, setNewCollaborator] = useState({})
  const [isShareFormulationModalOpen, setIsShareFormulationModalOpen] = useState(false)
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  // choosing ingredients and nutrients to create feeds
  const [owner, setOwner] = useState()
  const [ingredients, setIngredients] = useState([])
  const [nutrients, setNutrients] = useState([])
  const [isChooseIngredientsModalOpen, setIsChooseIngredientsModalOpen] = useState(false)
  const [isChooseNutrientsModalOpen, setIsChooseNutrientsModalOpen] = useState(false)

  useEffect(() => {
    fetchOwner()
    // make sure owner has been fetched before getting the ingredients and nutrients
    if (owner) {
      fetchIngredients()
      fetchNutrients()
    }
  }, [owner]);

  useEffect(() => {
    fetchCollaboratorData();
    setIsLoading(false);
  }, [formulation.collaborators]);

  console.log("owner", owner)
  console.log("ingredients", ingredients);
  console.log("nutrients", nutrients);

  const fetchOwner = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/formulation/owner/${id}`);
      setOwner(res.data.owner);
    } catch (err) {
      console.log(err)
    }
  }

  const fetchIngredients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ingredient/filtered/${owner}`);
      const fetchedData = res.data.ingredients;
      setIngredients(fetchedData);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchNutrients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/nutrient/filtered/${owner}`);
      const fetchedData = res.data.nutrients;
      setNutrients(fetchedData);
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCollaboratorData = async () => {
    try {
      if (!formulation.collaborators) return;
      // get details of collaborators
      const collaboratorPromises = formulation.collaborators.map(async (collaborator) => {
        const res = await axios.get(`${VITE_API_URL}/user-check/id/${collaborator.userId}`);
        return {
          ...res.data.user,
          access: collaborator.access,
        };
      })
      // wait for all requests to complete
      const collaboratorsData = await Promise.all(collaboratorPromises);
      setCollaborators(collaboratorsData);
    } catch (err) {
      console.log(err);
    }
  }



  const handleFocus = (inputId) => {
    setFocusedInput(inputId)
  }

  const handleBlur = () => {
    setFocusedInput(null)
  }

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

  const handleOpenShareFormulationModal = () => {
    if (userAccess === 'owner') {
      setIsShareFormulationModalOpen(true)
    } else {
      setShowToast(true)
      setMessage('Only the owner can share the formulation.')
      setToastAction('error')
    }
  }

  const goToConfirmationModal = (type, collaborator, message) => {
    if (type === 'error') {
      // toast instructions
      setShowToast(true)
      setMessage(message)
      setToastAction('error')
    } else if (type === 'linkCopied') {
      setShowToast(true)
      setMessage(message)
      setToastAction('success')
    }
    else {
      setNewCollaborator(collaborator);
      setIsAddCollaboratorModalOpen(true);
    }
  }
  const handleAddCollaborator = async () => {
    try {
      const res = await axios.put(`${VITE_API_URL}/formulation/collaborator/${id}`, {
        'updaterId': user._id,
        'collaboratorId': newCollaborator.newId,
        'access': newCollaborator.newAccess,
      })

      const newCollaboratorData = {
        _id: newCollaborator.newId,
        email: newCollaborator.newEmail,
        access: newCollaborator.newAccess,
        profilePicture: newCollaborator.newProfilePicture,
        displayName: newCollaborator.newDisplayName,
      }
      setCollaborators([...collaborators, newCollaboratorData])
      setShowToast(true)
      setMessage('Collaborator added successfully')
      setToastAction('success')

    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateCollaborator = (updatedCollaborators) => {
    setCollaborators(updatedCollaborators);
    setShowToast(true)
    setMessage('Collaborator updated successfully')
    setToastAction('success')
  }

  const handleDeleteCollaborator = async (collaboratorId) => {
    try {
      const res = await axios.delete(`${VITE_API_URL}/formulation/collaborator/${id}/${collaboratorId}`)
      setCollaborators(collaborators.filter(collaborator => collaborator._id !== collaboratorId))
      setShowToast(true)
      setMessage('Collaborator deleted successfully')
      setToastAction('success')
    } catch (err) {
      console.log(err);
    }
  }


  // loading due to api calls
  if (isLoading) {
    return <Loading />
  }
  // loading due to liveblocks storage
  if (!formulationRealTime) {
    return <Loading />
  }

  const { code, name, description, animal_group } = formulationRealTime;
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
                {others.map(({ connectionId, info }) => (
                  <Avatar
                    key={connectionId}
                    src={info.avatar}
                    name={info.name}
                  />
                ))}
                <Avatar src={self.info.avatar} name="You" />
              </div>
              <div
                className={`${userAccess !== 'owner' && 'tooltip md:tooltip-left'}`}
                data-tip={`${userAccess !== 'owner' && 'Only the owner can share this formulation.'}`}
              >
                <button
                  disabled={userAccess !== 'owner'}
                  onClick={handleOpenShareFormulationModal}
                  className="btn btn-sm gap-1 rounded-lg text-xs"
                >
                  <RiShareLine /> Share ▼
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="label text-sm font-medium">Code</label>
              <input
                id="input-code"
                type="text"
                className="input input-bordered w-full rounded-xl"
                value={code}
                onFocus={(e) => updateMyPresence({ focusedId: e.target.id })}
                onBlur={() => updateMyPresence({ focusedId: null })}
                onChange={(e) => updateCode(e.target.value)}
                maxLength={20}
              />
              <Selections id="input-code" others={others} />
            </div>
            <div>
              <label className="label text-sm font-medium">
                Formulation name
              </label>
              <input
                id="input-name"
                type="text"
                className="input input-bordered w-full rounded-xl"
                value={name}
                onFocus={(e) => updateMyPresence({ focusedId: e.target.id })}
                onBlur={() => updateMyPresence({ focusedId: null })}
                onChange={(e) => updateName(e.target.value)}
                maxLength={20}
              />
              <Selections id="input-name" others={others} />
            </div>
            <div className="md:col-span-2">
              <label className="label text-sm font-medium">Description</label>
              <input
                id="input-description"
                type="text"
                className="input input-bordered w-full rounded-xl"
                value={description}
                onFocus={(e) => updateMyPresence({ focusedId: e.target.id })}
                onBlur={() => updateMyPresence({ focusedId: null })}
                onChange={(e) => updateDescription(e.target.value)}
              />
              <Selections id="input-description" others={others} />
            </div>
            <div className="md:col-span-2">
              <label className="label text-sm font-medium">Animal group</label>
              <select
                id="input-animal_group"
                className="select select-bordered w-full rounded-xl"
                name="input-animal_group"
                value={animal_group}
                onFocus={(e) => updateMyPresence({ focusedId: e.target.id })}
                onBlur={() => updateMyPresence({ focusedId: null })}
                onChange={(e) => updateAnimalGroup(e.target.value)}
              >
                <option value="Swine">Swine</option>
                <option value="Pig">Pig</option>
                <option value="Poultry">Poultry</option>
              </select>
              <Selections id="input-animal_group" others={others} />
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
                <button
                  onClick={() => setIsChooseIngredientsModalOpen(true)}
                  className="bg-green-button flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700"
                >
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
                <button
                  onClick={() => setIsChooseNutrientsModalOpen(true)}
                  className="bg-green-button flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700"
                >
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

      {/*  Modals */}
      <ShareFormulationModal
        isOpen={isShareFormulationModalOpen}
        onClose={() => setIsShareFormulationModalOpen(false)}
        onAdd={goToConfirmationModal}
        onEdit={handleUpdateCollaborator}
        onDelete={handleDeleteCollaborator}
        userId={user._id}
        formulation={formulation}
        collaborators={collaborators}
      />
      <ConfirmationModal
        isOpen={isAddCollaboratorModalOpen}
        onClose={() => setIsAddCollaboratorModalOpen(false)}
        onConfirm={handleAddCollaborator}
        title="Add collaborator"
        description={
          <>
            Add <strong>{newCollaborator.newEmail}</strong> as a collaborator to
            this formulation?
          </>
        }
        type="add"
      />

      <ChooseIngredientsModal
        isOpen={isChooseIngredientsModalOpen}
        onClose={() => setIsChooseIngredientsModalOpen(false)}
        ingredients={ingredients}
        // onResult={handleCreateResult}
      />
      <ChooseNutrientsModal
        isOpen={isChooseNutrientsModalOpen}
        onClose={() => setIsChooseNutrientsModalOpen(false)}
        nutrients={nutrients}
        // onResult={handleCreateResult}
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

function Selections({ id, others }) {
  return (
    <>
      {others.map(({ connectionId, info, presence }) => {
        if (presence.focusedId === id) {
          return (
            <Selection
              key={connectionId}
              name={info.name}
              color={COLORS[connectionId % COLORS.length]}
            />
          );
        }
      })}
    </>
  );
}

export default ViewFormulation
