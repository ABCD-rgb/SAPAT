import {Navigate, useParams} from 'react-router-dom'
import { useState } from 'react'
import useAuth from "../../hook/useAuth.js";
import Loading from "../../components/Loading.jsx";
import ViewFormulation from "./ViewFormulation.jsx"


function ViewFormulationEntry() {
  const { id } = useParams()
  const { user, loading } = useAuth()


  // toast visibility
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [toastAction, setToastAction] = useState('')

  const hideToast = () => {
    setShowToast(false)
    setMessage('')
    setToastAction('')
  }


  if (loading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <ViewFormulation
      id={id}
      user={user}
    />
  )
}

export default ViewFormulationEntry
