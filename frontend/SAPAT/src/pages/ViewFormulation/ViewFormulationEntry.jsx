"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import useAuth from "../../hook/useAuth.js";
import Loading from "../../components/Loading.jsx";
import ViewFormulation from "./ViewFormulation.jsx"


function ViewFormulationEntry({id}) {
  const { user, loading } = useAuth()
  const others = useOthers();
  const self = useSelf();
  console.log("LB Others: ", others);
  console.log("LB Self: ", self);


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
        <>
          <ViewFormulation
            id={id}
            user={user}
            self={self}
            others={others}
          />
        </>

  )
}

export default ViewFormulationEntry
