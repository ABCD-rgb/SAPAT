import {
  RiShareLine,
  RiAddLine,
  RiCalculatorLine,
  RiFileChartLine,
  RiDeleteBinLine,
  RiSave2Line,
} from 'react-icons/ri'
import Info from '../../components/icons/Info.jsx'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../../components/Loading.jsx'
import ShareFormulationModal from '../../components/modals/formulations/ShareFormulationModal.jsx'
import ConfirmationModal from '../../components/modals/ConfirmationModal.jsx'
import Toast from '../../components/Toast.jsx'
import Avatar from '../../components/Avatar.jsx'
import Selection from '../../components/Selection.jsx'
import ChooseIngredientsModal from '../../components/modals/viewformulation/ChooseIngredientsModal.jsx'
import ChooseNutrientsModal from '../../components/modals/viewformulation/ChooseNutrientsModal.jsx'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import Warning from '../../components/icons/Warning.jsx'
import GenerateReport from '../../components/buttons/GenerateReport.jsx'
const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']

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
  updateCost,
  updateIngredients,
  updateNutrients,
  updateIngredientProperty,
  updateNutrientProperty,
  handleSave,
}) {
  const VITE_API_URL = import.meta.env.VITE_API_URL

  const [collaborators, setCollaborators] = useState([])
  const [newCollaborator, setNewCollaborator] = useState({})

  const [isShareFormulationModalOpen, setIsShareFormulationModalOpen] =
    useState(false)
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] =
    useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  // all available ingredients and nutrients of the owner
  const [listOfIngredients, setListOfIngredients] = useState([])
  const [listOfNutrients, setListOfNutrients] = useState([])

  // choosing ingredients and nutrients to create feeds
  const [owner, setOwner] = useState()
  const [ingredientsMenu, setIngredientsMenu] = useState([])
  const [nutrientsMenu, setNutrientsMenu] = useState([])
  const [isChooseIngredientsModalOpen, setIsChooseIngredientsModalOpen] =
    useState(false)
  const [isChooseNutrientsModalOpen, setIsChooseNutrientsModalOpen] =
    useState(false)

  // chosen ingredients and nutrients
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedNutrients, setSelectedNutrients] = useState([])

  // un-updated ingredient/nutrient values (when user enters new min/max that has not been optimized yet)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (formulation) {
      setSelectedIngredients(formulation.ingredients || [])
      setSelectedNutrients(formulation.nutrients || [])
    }
  }, [formulation])

  useEffect(() => {
    fetchOwner()
    // make sure owner has been fetched before getting the ingredients and nutrients (these are for choosing in the 'add ingredients' and 'add nutrients')
    if (owner && formulation) {
      fetchIngredients()
      fetchNutrients()
    }
  }, [owner, formulation])

  useEffect(() => {
    fetchCollaboratorData()
    setIsLoading(false)
  }, [formulation.collaborators])

  useEffect(() => {
    isDirty && updateCost(0)
  }, [isDirty])

  const fetchOwner = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/formulation/owner/${id}`
      )
      setOwner(res.data.owner)
    } catch (err) {
      console.log(err)
    }
  }

  // Sync on saving using 'ctrl + s'
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault() // Prevent the default browser save action
        handleSave(isDirty) // Call database update function
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isDirty])

  const fetchIngredients = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ingredient/filtered/${owner}?limit=10000`
      )
      const fetchedData = res.data.ingredients
      setListOfIngredients(fetchedData)
      // don't include already added ingredients to the ingredients menu
      const arr2Ids = new Set(
        formulation.ingredients.map((item) => item.ingredient_id)
      ) // ingredients already in the formulation
      const unusedIngredients = fetchedData.filter(
        (item) => !arr2Ids.has(item.ingredient_id || item._id)
      )
      setIngredientsMenu(unusedIngredients)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchNutrients = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/nutrient/filtered/${owner}?limit=10000`
      )
      const fetchedData = res.data.nutrients
      setListOfNutrients(fetchedData)
      // don't include already added nutrients to the nutrients menu
      const arr2Ids = new Set(
        formulation.nutrients.map((item) => item.nutrient_id)
      ) // nutrients already in the formulation
      const unusedNutrients = fetchedData.filter(
        (item) => !arr2Ids.has(item.nutrient_id || item._id)
      )
      setNutrientsMenu(unusedNutrients)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCollaboratorData = async () => {
    try {
      if (!formulation.collaborators) return
      // get details of collaborators
      const collaboratorPromises = formulation.collaborators.map(
        async (collaborator) => {
          const res = await axios.get(
            `${VITE_API_URL}/user-check/id/${collaborator.userId}`
          )
          return {
            ...res.data.user,
            access: collaborator.access,
          }
        }
      )
      // wait for all requests to complete
      const collaboratorsData = await Promise.all(collaboratorPromises)
      setCollaborators(collaboratorsData)
    } catch (err) {
      console.log(err)
    }
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
    } else {
      setNewCollaborator(collaborator)
      setIsAddCollaboratorModalOpen(true)
    }
  }

  const handleOptimize = async (
    ingredientsData,
    ingredients,
    nutrients,
    type
  ) => {
    try {
      const res = await axios.post(`${VITE_API_URL}/optimize/${type}`, {
        ingredientsData,
        ingredients,
        nutrients,
      })
      const optimizedCost = res.data.optimizedCost
      const optimizedIngredients = res.data.optimizedIngredients
      const optimizedNutrients = res.data.optimizedNutrients

      updateCost(optimizedCost)
      optimizedIngredients.map((ing, index) => {
        updateIngredientProperty(index, 'value', Number(ing.value))
      })
      optimizedNutrients.map((nut, index) => {
        updateNutrientProperty(index, 'value', Number(nut.value))
      })
      setIsDirty(false)
    } catch (err) {
      if (err.response.data.status === 'No optimal solution') {
        // toast instructions
        setShowToast(true)
        setMessage(`No feasible formula found. Please adjust your constraints.`)
        setToastAction('error')
        ingredients.map((ing, index) => {
          updateIngredientProperty(index, 'value', 0)
        })
        nutrients.map((ing, index) => {
          updateNutrientProperty(index, 'value', 0)
        })
      }
    }
  }

  const handleAddCollaborator = async () => {
    try {
      const res = await axios.put(
        `${VITE_API_URL}/formulation/collaborator/${id}`,
        {
          updaterId: user._id,
          collaboratorId: newCollaborator.newId,
          access: newCollaborator.newAccess,
        }
      )

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
      console.log(err)
    }
  }

  const handleUpdateCollaborator = (updatedCollaborators) => {
    setCollaborators(updatedCollaborators)
    setShowToast(true)
    setMessage('Collaborator updated successfully')
    setToastAction('success')
  }

  const handleDeleteCollaborator = async (collaboratorId) => {
    try {
      const res = await axios.delete(
        `${VITE_API_URL}/formulation/collaborator/${id}/${collaboratorId}`
      )
      setCollaborators(
        collaborators.filter(
          (collaborator) => collaborator._id !== collaboratorId
        )
      )
      setShowToast(true)
      setMessage('Collaborator deleted successfully')
      setToastAction('success')
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddIngredients = async (ingredientsToAdd) => {
    try {
      const res = await axios.put(
        `${VITE_API_URL}/formulation/ingredients/${id}`,
        { ingredients: ingredientsToAdd }
      )
      const newIngredients = res.data.addedIngredients
      const formattedIngredients = newIngredients.map((ingredient) => {
        // at initial add, all values are zero
        return {
          ...ingredient,
          minimum: 0,
          maximum: 0,
          value: 0,
        }
      })
      setSelectedIngredients([...selectedIngredients, ...formattedIngredients])
      const arr2Ids = new Set(
        formattedIngredients.map((item) => item.ingredient_id)
      )
      setIngredientsMenu((prev) =>
        prev.filter((item) => !arr2Ids.has(item.ingredient_id || item._id))
      )
      updateCost(0)
      updateIngredients([...selectedIngredients, ...formattedIngredients])
      setIsChooseIngredientsModalOpen(false)
      // toast instructions
      setShowToast(true)
      setMessage('Ingredients added successfully')
      setToastAction('success')
    } catch (err) {
      console.log(err)
      // toast instructions
      setShowToast(true)
      setMessage('Error adding ingredients')
      setToastAction('error')
    }
  }

  const handleAddNutrients = async (nutrientsToAdd) => {
    try {
      const res = await axios.put(
        `${VITE_API_URL}/formulation/nutrients/${id}`,
        { nutrients: nutrientsToAdd }
      )
      const newNutrients = res.data.addedNutrients
      // at initial add, all values are zero
      const formattedNutrients = newNutrients.map((nutrient) => {
        return {
          ...nutrient,
          minimum: 0,
          maximum: 0,
          value: 0,
        }
      })
      setSelectedNutrients([...selectedNutrients, ...formattedNutrients])
      const arr2Ids = new Set(
        formattedNutrients.map((item) => item.nutrient_id)
      )
      setNutrientsMenu((prev) =>
        prev.filter((item) => !arr2Ids.has(item.nutrient_id || item._id))
      )
      updateCost(0)
      updateNutrients([...selectedNutrients, ...formattedNutrients])
      setIsChooseNutrientsModalOpen(false)
      // toast instructions
      setShowToast(true)
      setMessage('Nutrients added successfully')
      setToastAction('success')
    } catch (err) {
      console.log(err)
      // toast instructions
      setShowToast(true)
      setMessage('Error adding nutrients')
      setToastAction('error')
    }
  }

  const handleRemoveIngredient = async (ingredientToRemove) => {
    try {
      const res = await axios.delete(
        `${VITE_API_URL}/formulation/ingredients/${id}/${ingredientToRemove.ingredient_id}`
      )
      // remove ingredientToRemove from selected ingredients
      setSelectedIngredients(
        selectedIngredients.filter(
          (item) => item.ingredient_id !== ingredientToRemove.ingredient_id
        )
      )
      updateIngredients(
        ingredients.filter(
          (item) => item.ingredient_id !== ingredientToRemove.ingredient_id
        )
      )
      // add ingredientToRemove to ingredients menu
      const removedIngredient = listOfIngredients.find((item) =>
        item.ingredient_id
          ? item.ingredient_id === ingredientToRemove.ingredient_id
          : item._id === ingredientToRemove.ingredient_id
      )
      if (removedIngredient) {
        setIngredientsMenu([removedIngredient, ...ingredientsMenu])
      }
      updateCost(0)
      // toast instructions
      setShowToast(true)
      setMessage('Ingredient removed successfully')
      setToastAction('success')
    } catch (err) {
      console.log(err)
      // toast instructions
      setShowToast(true)
      setMessage('Error removing ingredient')
      setToastAction('error')
    }
  }

  const handleRemoveNutrient = async (nutrientToRemove) => {
    try {
      const res = await axios.delete(
        `${VITE_API_URL}/formulation/nutrients/${id}/${nutrientToRemove.nutrient_id}`
      )
      // remove nutrientToRemove from selected nutrients
      setSelectedNutrients(
        selectedNutrients.filter(
          (item) => item.nutrient_id !== nutrientToRemove.nutrient_id
        )
      )
      updateNutrients(
        nutrients.filter(
          (item) => item.nutrient_id !== nutrientToRemove.nutrient_id
        )
      )
      // add nutrientToRemove to nutrients menu
      const removedNutrient = listOfNutrients.find((item) =>
        item.nutrient_id
          ? item.nutrient_id === nutrientToRemove.nutrient_id
          : item._id === nutrientToRemove.nutrient_id
      )
      if (removedNutrient) {
        setNutrientsMenu([removedNutrient, ...nutrientsMenu])
      }
      updateCost(0)
      // toast instructions
      setShowToast(true)
      setMessage('Nutrient removed successfully')
      setToastAction('success')
    } catch (err) {
      console.log(err)
      // toast instructions
      setShowToast(true)
      setMessage('Error removing nutrient')
      setToastAction('error')
    }
  }

  const handleIngredientMinimumChange = (index, value) => {
    value === 'N/A' || value === ''
      ? updateIngredientProperty(index, 'minimum', 0)
      : updateIngredientProperty(index, 'minimum', value)
  }

  const handleIngredientMaximumChange = (index, value) => {
    value === 'N/A' || value === ''
      ? updateIngredientProperty(index, 'maximum', 0)
      : updateIngredientProperty(index, 'maximum', value)
  }

  const handleNutrientMinimumChange = (index, value) => {
    value === 'N/A' || value === ''
      ? updateNutrientProperty(index, 'minimum', 0)
      : updateNutrientProperty(index, 'minimum', value)
  }

  const handleNutrientMaximumChange = (index, value) => {
    value === 'N/A' || value === ''
      ? updateNutrientProperty(index, 'maximum', 0)
      : updateNutrientProperty(index, 'maximum', value)
  }

  // Render function for Ingredients table rows
  const renderIngredientsTableRows = () => {
    if (ingredients) {
      return ingredients.map((ingredient, index) => (
        <tr key={index} className="hover:bg-base-300">
          <td>{ingredient.name}</td>
          <td>
            <input
              id={`ingredient-${index}-minimum`}
              type="text"
              className="input input-bordered input-xs w-15"
              disabled={userAccess === 'view'}
              value={ingredient.minimum !== 0 ? ingredient.minimum : 'N/A'}
              onChange={(e) => {
                const inputValue = e.target.value
                // in consideration for 'N/A' values which means 0
                if (
                  /^N\/A(\d+|\.)/.test(inputValue) ||
                  /^\d*\.?\d{0,2}$/.test(inputValue)
                ) {
                  // to allow rewriting of input if user types a number after clicking on input with 'N/A'
                  const processedValue = /^N\/A\d*/.test(inputValue)
                    ? inputValue.replace('N/A', '')
                    : inputValue
                  handleIngredientMinimumChange(index, processedValue)
                  setIsDirty(true)
                }
              }}
              onFocus={() => {
                updateMyPresence({ focusedId: `ingredient-${index}-minimum` })
              }}
              onBlur={() => updateMyPresence({ focusedId: null })}
            />
            <Selections id={`ingredient-${index}-minimum`} others={others} />
          </td>
          <td>
            <input
              id={`ingredient-${index}-maximum`}
              type="text"
              className="input input-bordered input-xs w-15"
              disabled={userAccess === 'view'}
              value={ingredient.maximum !== 0 ? ingredient.maximum : 'N/A'}
              onChange={(e) => {
                const inputValue = e.target.value
                // in consideration for 'N/A' values which means 0
                if (
                  /^N\/A(\d+|\.)/.test(inputValue) ||
                  /^\d*\.?\d{0,2}$/.test(inputValue)
                ) {
                  // to allow rewriting of input if user types a number after clicking on input with 'N/A'
                  let processedValue = /^N\/A\d*/.test(inputValue)
                    ? inputValue.replace('N/A', '')
                    : inputValue
                  // limit max constraint of ingredient to 100
                  const numericValue = parseFloat(processedValue)
                  if (!isNaN(numericValue) && numericValue > 100) {
                    processedValue = '100'
                  }
                  handleIngredientMaximumChange(index, processedValue)
                  setIsDirty(true)
                }
              }}
              onFocus={() =>
                updateMyPresence({ focusedId: `ingredient-${index}-maximum` })
              }
              onBlur={() => updateMyPresence({ focusedId: null })}
            />
            <Selections id={`ingredient-${index}-maximum`} others={others} />
          </td>
          <td>{ingredient.value}</td>
          <td>
            <button
              disabled={userAccess === 'view'}
              className="btn btn-ghost btn-xs text-red-500 hover:bg-red-200"
              onClick={() => handleRemoveIngredient(ingredient)}
            >
              <RiDeleteBinLine />
            </button>
          </td>
        </tr>
      ))
    }
  }

  // Render function for Nutrients table rows
  const renderNutrientsTableRows = () => {
    if (nutrients) {
      return nutrients.map((nutrient, index) => (
        <tr key={index} className="hover:bg-base-300">
          <td>{nutrient.name}</td>
          <td>
            <input
              type="text"
              className="input input-bordered input-xs w-15"
              disabled={userAccess === 'view'}
              value={nutrient.minimum !== 0 ? nutrient.minimum : 'N/A'}
              onChange={(e) => {
                const inputValue = e.target.value
                // in consideration for 'N/A' values which means 0
                if (
                  /^N\/A(\d+|\.)/.test(inputValue) ||
                  /^\d*\.?\d{0,2}$/.test(inputValue)
                ) {
                  // to allow rewriting of input if user types a number after clicking on input with 'N/A'
                  const processedValue = /^N\/A\d*/.test(inputValue)
                    ? inputValue.replace('N/A', '')
                    : inputValue
                  handleNutrientMinimumChange(index, processedValue)
                  setIsDirty(true)
                }
              }}
              onFocus={() =>
                updateMyPresence({ focusedId: `nutrient-${index}-minimum` })
              }
              onBlur={() => updateMyPresence({ focusedId: null })}
            />
            <Selections id={`nutrient-${index}-minimum`} others={others} />
          </td>
          <td>
            <input
              type="text"
              className="input input-bordered input-xs w-15"
              disabled={userAccess === 'view'}
              value={nutrient.maximum !== 0 ? nutrient.maximum : 'N/A'}
              onChange={(e) => {
                const inputValue = e.target.value
                // in consideration for 'N/A' values which means 0
                if (
                  /^N\/A(\d+|\.)/.test(inputValue) ||
                  /^\d*\.?\d{0,2}$/.test(inputValue)
                ) {
                  // to allow rewriting of input if user types a number after clicking on input with 'N/A'
                  const processedValue = /^N\/A\d*/.test(inputValue)
                    ? inputValue.replace('N/A', '')
                    : inputValue
                  handleNutrientMaximumChange(index, processedValue)
                  setIsDirty(true)
                }
              }}
              onFocus={() =>
                updateMyPresence({ focusedId: `nutrient-${index}-maximum` })
              }
              onBlur={() => updateMyPresence({ focusedId: null })}
            />
            <Selections id={`nutrient-${index}-maximum`} others={others} />
          </td>
          <td>{nutrient.value}</td>
          <td>
            <button
              disabled={userAccess === 'view'}
              className="btn btn-ghost btn-xs text-red-500 hover:bg-red-200"
              onClick={() => handleRemoveNutrient(nutrient)}
            >
              <RiDeleteBinLine />
            </button>
          </td>
        </tr>
      ))
    }
  }

  // loading due to api calls
  if (isLoading || formulation.length === 0 || !owner) {
    return <Loading />
  }
  // loading due to liveblocks storage
  if (!formulationRealTime) {
    return <Loading />
  }

  const {
    code,
    name,
    description,
    animal_group,
    cost,
    ingredients,
    nutrients,
  } = formulationRealTime

  return (
    <div className="flex h-full flex-col bg-gray-50 md:flex-row">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {/* Header */}
          <h1 className="text-deepbrown mb-3 text-xl font-bold md:text-2xl">
            View Formulation
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/*<div className="flex flex-wrap gap-2">*/}
            {/*  <button*/}
            {/*    disabled={userAccess === 'view'}*/}
            {/*    className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors hover:text-white disabled:hidden"*/}
            {/*  >*/}
            {/*    <RiFileUploadLine className="h-4 w-4 md:h-5 md:w-5" />*/}
            {/*    <span>Import</span>*/}
            {/*  </button>*/}
            {/*  <button className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors hover:text-white">*/}
            {/*    <RiFileDownloadLine className="h-4 w-4 md:h-5 md:w-5" />*/}
            {/*    <span>Export</span>*/}
            {/*  </button>*/}
            {/*</div>*/}
            <div className="flex items-center gap-2">
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
              <div>
                <button
                  className="btn bg-green-button btn-sm gap-1 rounded-lg text-xs text-white transition-colors hover:bg-green-600 active:bg-green-700"
                  onClick={() => handleSave(isDirty)}
                >
                  <RiSave2Line className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="label text-sm font-medium">Code</label>
              <input
                id="input-code"
                type="text"
                className="input input-bordered w-full rounded-xl"
                disabled={userAccess === 'view'}
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
                disabled={userAccess === 'view'}
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
                disabled={userAccess === 'view'}
                value={description}
                onFocus={(e) => updateMyPresence({ focusedId: e.target.id })}
                onBlur={() => updateMyPresence({ focusedId: null })}
                onChange={(e) => updateDescription(e.target.value)}
              />
              <Selections id="input-description" others={others} />
            </div>
            <div>
              <label className="label text-sm font-medium">Animal group</label>
              <select
                id="input-animal_group"
                className="select select-bordered w-full rounded-xl"
                disabled={userAccess === 'view'}
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

          {/* Shown when values are not up-to-date */}
          {isDirty && (
            <div className="alert alert-warning alert-soft">
              <Warning />
              <span>
                Formula constraints have changed. Click &quot;Optimize&quot; to
                update values.
              </span>
            </div>
          )}

          {/* Tables - Grid on desktop, Stack on mobile */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Ingredients Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="p-4">
                <h3 className="mb-2 text-sm font-semibold">Ingredients</h3>
                <p className="flex text-xs text-gray-500">
                  <Info /> Ingredients used in your feed mix. Values show kg per
                  100kg (ratio). Set min/max to control amounts.
                </p>
              </div>
              <div className="max-h-64 overflow-x-auto overflow-y-auto">
                <table className="table-sm table-pin-rows table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{renderIngredientsTableRows()}</tbody>
                </table>
              </div>
              <div className="p-4">
                <button
                  disabled={userAccess === 'view'}
                  onClick={() => setIsChooseIngredientsModalOpen(true)}
                  className="bg-green-button flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <RiAddLine /> Add ingredient
                </button>
              </div>
            </div>

            {/* Nutrients Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="p-4">
                <h3 className="mb-2 text-sm font-semibold">Nutrients</h3>
                <p className="flex text-xs text-gray-500">
                  <Info /> Nutritional content of your feed. Set min/max values
                  to meet animal needs.
                </p>
              </div>
              <div className="max-h-64 overflow-x-auto overflow-y-auto">
                <table className="table-sm table-pin-rows table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{renderNutrientsTableRows()}</tbody>
                </table>
              </div>
              <div className="p-4">
                <button
                  disabled={userAccess === 'view'}
                  onClick={() => setIsChooseNutrientsModalOpen(true)}
                  className="bg-green-button flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <RiAddLine /> Add nutrient
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-2">
            <div className="flex items-center justify-end gap-1 pr-2">
              <span className="text-sm font-medium text-gray-600">
                Total cost (per 100 kg):
              </span>
              <span className="text-green-button text-lg font-bold underline">
                ₱ {cost}
              </span>
            </div>
            <div className="dropdown dropdown-hover dropdown-top">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-primary btn-md gap-2rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                disabled={userAccess === 'view'}
              >
                <RiCalculatorLine className="text-lg" /> Optimize
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-200 rounded-box shadow-primary z-10 w-56 p-3 shadow-lg"
              >
                <li>
                  <button
                    className="hover:bg-primary hover:text-primary-content flex items-center rounded-lg py-2 transition-colors duration-200"
                    onClick={() => {
                      handleOptimize(
                        listOfIngredients || [],
                        ingredients || [],
                        nutrients || [],
                        'simplex'
                      )
                    }}
                  >
                    Simplex
                  </button>
                </li>
                <li>
                  <button
                    className="hover:bg-primary hover:text-primary-content flex items-center rounded-lg py-2 transition-colors duration-200"
                    onClick={() => {
                      handleOptimize(
                        listOfIngredients || [],
                        ingredients || [],
                        nutrients || [],
                        'pso'
                      )
                    }}
                  >
                    Particle Swarm Optimization
                  </button>
                </li>
              </ul>
            </div>
            <GenerateReport
              userAccess={userAccess}
              formulation={formulationRealTime}
            />
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
        ingredients={ingredientsMenu}
        onResult={handleAddIngredients}
      />
      <ChooseNutrientsModal
        isOpen={isChooseNutrientsModalOpen}
        onClose={() => setIsChooseNutrientsModalOpen(false)}
        nutrients={nutrientsMenu}
        onResult={handleAddNutrients}
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
          )
        }
      })}
    </>
  )
}

export default ViewFormulation
