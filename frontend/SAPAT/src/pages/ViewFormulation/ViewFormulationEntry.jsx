'use client'

import {
  useOthers,
  useSelf,
  useUpdateMyPresence,
  useMutation,
  useStorage,
} from '@liveblocks/react/suspense'
import { Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import useAuth from '../../hook/useAuth.js'
import Loading from '../../components/Loading.jsx'
import ViewFormulation from './ViewFormulation.jsx'
import Toast from '../../components/Toast.jsx'

function ViewFormulationEntry({ id }) {
  const VITE_API_URL = import.meta.env.VITE_API_URL
  const location = useLocation() // Track URL changes
  const { user, loading } = useAuth()
  const others = useOthers()
  const self = useSelf()
  const updateMyPresence = useUpdateMyPresence()

  const formulationRealTime = useStorage((root) => root.formulation)

  const updateCode = useMutation(({ storage }, code) => {
    storage.get('formulation').set('code', code)
  }, [])
  const updateName = useMutation(({ storage }, name) => {
    storage.get('formulation').set('name', name)
  }, [])
  const updateDescription = useMutation(({ storage }, description) => {
    storage.get('formulation').set('description', description)
  }, [])
  const updateAnimalGroup = useMutation(({ storage }, animal_group) => {
    storage.get('formulation').set('animal_group', animal_group)
  }, [])
  const updateIngredients = useMutation(({ storage }, ingredients) => {
    storage.get('formulation').set('ingredients', ingredients)
  }, [])
  const updateNutrients = useMutation(({ storage }, nutrients) => {
    storage.get('formulation').set('nutrients', nutrients)
  }, [])

  // Update a specific ingredient's property
  const updateIngredientProperty = useMutation(
    ({ storage }, ingredientIndex, propertyName, propertyValue) => {
      const ingredients = storage.get('formulation').get('ingredients')
      // Create a new array with the updated ingredient
      const updatedIngredients = ingredients.map((ingredient, index) =>
        index === ingredientIndex
          ? { ...ingredient, [propertyName]: propertyValue }
          : ingredient
      )
      // Update the entire ingredients array
      storage.get('formulation').set('ingredients', updatedIngredients)
    },
    []
  )

  // Update a specific nutrient's property
  const updateNutrientProperty = useMutation(
    ({ storage }, nutrientIndex, propertyName, propertyValue) => {
      const nutrients = storage.get('formulation').get('nutrients')
      // Create a new array with the updated nutrient
      const updatedNutrients = nutrients.map((nutrient, index) =>
        index === nutrientIndex
          ? { ...nutrient, [propertyName]: propertyValue }
          : nutrient
      )
      // Update the entire nutrients array
      storage.get('formulation').set('nutrients', updatedNutrients)
    },
    []
  )

  const [formulation, setFormulation] = useState({
    code: '',
    name: '',
    description: '',
    animal_group: '',
    ingredients: [],
    nutrients: [],
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [userAccess, setUserAccess] = useState('')
  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  const formulationRef = useRef(formulationRealTime)

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }

  useEffect(() => {
    formulationRef.current = formulationRealTime // Always sync the ref with the latest formulation
  }, [formulationRealTime])

  useEffect(() => {
    if (user) {
      fetchFormulationData()
      checkAccess()
    }
  }, [user])

  // Auto-sync on internal navigation (when the URL changes)
  useEffect(() => {
    return () => {
      updateDatabase() // Sync before navigating away
    }
  }, [location.pathname]) // Runs when the user changes the page within the app

  // Sync on saving using 'ctrl + s'
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault() // Prevent the default browser save action
        updateDatabase() // Call database update function
        setShowToast(true) // Show success toast
        setMessage('Formulation saved successfully!')
        setToastAction('success')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const fetchFormulationData = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/formulation/${id}`)
      const formulationData = response.data.formulations
      setFormulation(formulationData)
      // update contents of liveblocks storage based on the database (when there are no other people editing yet)
      if (others.length === 0) {
        updateCode(formulationData.code)
        updateName(formulationData.name)
        updateDescription(formulationData.description)
        updateAnimalGroup(formulationData.animal_group)
        updateIngredients(formulationData.ingredients)
        updateNutrients(formulationData.nutrients)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const checkAccess = async () => {
    try {
      const res = await axios.get(
        `${VITE_API_URL}/formulation/collaborator/${id}/${user._id}`
      )
      if (res.data.access === 'notFound') {
        setShouldRedirect(true)
      }
      setUserAccess(res.data.access)
    } catch (err) {
      console.log(err)
    }
  }

  const updateDatabase = async () => {
    try {
      const currentFormulation = formulationRef.current
      const VITE_API_URL = import.meta.env.VITE_API_URL
      await axios.put(`${VITE_API_URL}/formulation/${id}`, {
        code: currentFormulation.code,
        name: currentFormulation.name,
        description: currentFormulation.description,
        animal_group: currentFormulation.animal_group,
        ingredients: currentFormulation.ingredients,
        nutrients: currentFormulation.nutrients,
      })
    } catch (error) {
      console.error('Error updating database:', error)
    }
  }

  if (shouldRedirect) {
    return <Navigate to="/formulations" />
  }
  if (loading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <>
      <ViewFormulation
        formulation={formulation}
        userAccess={userAccess}
        id={id}
        user={user}
        self={self}
        others={others}
        updateMyPresence={updateMyPresence}
        formulationRealTime={formulationRealTime}
        updateCode={updateCode}
        updateName={updateName}
        updateDescription={updateDescription}
        updateAnimalGroup={updateAnimalGroup}
        updateIngredients={updateIngredients}
        updateNutrients={updateNutrients}
        updateIngredientProperty={updateIngredientProperty}
        updateNutrientProperty={updateNutrientProperty}
      />
      {/*  Toasts */}
      <Toast
        className="transition delay-150 ease-in-out"
        show={showToast}
        action={toastAction}
        message={message}
        onHide={hideToast}
      />
    </>
  )
}

export default ViewFormulationEntry
