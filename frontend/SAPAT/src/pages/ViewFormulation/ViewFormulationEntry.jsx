"use client";

import {
  useOthers,
  useSelf,
  useUpdateMyPresence,
  useOthersMapped,
  useMutation,
  useStorage
} from "@liveblocks/react/suspense";
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import useAuth from "../../hook/useAuth.js";
import Loading from "../../components/Loading.jsx";
import ViewFormulation from "./ViewFormulation.jsx"


function ViewFormulationEntry({id}) {
  const { user, loading } = useAuth()
  const others = useOthers();
  const self = useSelf();
  const updateMyPresence = useUpdateMyPresence();
  console.log("LB Others: ", others);
  console.log("LB Self: ", self);

  const formulationRealTime = useStorage((root) => root.formulation);

  const updateCode = useMutation(({ storage }, code) => {
    storage.get("formulation").set("code", code);
  }, []);
  const updateName = useMutation(({ storage }, name) => {
    storage.get("formulation").set("name", name);
  }, []);
  const updateDescription = useMutation(({ storage }, description) => {
    storage.get("formulation").set("description", description);
  }, []);
  const updateAnimalGroup = useMutation(({ storage }, animal_group) => {
    storage.get("formulation").set("animal_group", animal_group);
  }, []);



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
            updateMyPresence={updateMyPresence}
            formulationRealTime={formulationRealTime}
            updateCode={updateCode}
            updateName={updateName}
            updateDescription={updateDescription}
            updateAnimalGroup={updateAnimalGroup}
          />
        </>

  )
}

export default ViewFormulationEntry
