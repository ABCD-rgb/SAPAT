import { RiCloseLine } from 'react-icons/ri'
import { MdLink } from "react-icons/md";
import {useEffect, useState} from "react";
import axios from "axios";


function ShareFormulationModal({ isOpen, onClose, onAdd, formulation, collaborators }) {
  const [newCollaborator, setNewCollaborator] = useState({
    newId: '',
    newDisplayName: '',
    newProfilePicture: '',
    newEmail: '',
    newAccess: 'edit',
  })


  const handleNewCollaborator = async (e) => {
    e.preventDefault()
    try {
      // get collaborator details based on newCollaborator.newCollaboratorEmail
      const userData = await fetchNewCollaboratorDataByEmail();
      // only call this if success
      if (userData) {
        onAdd('success', newCollaborator);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewCollaborator((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchNewCollaboratorDataByEmail = async() => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-check/email/${newCollaborator.newEmail}`)
      const userData = res.data.user[0];
      setNewCollaborator((prev) => ({
        ...prev,
        'newId': userData._id,
        'newDisplayName': userData.displayName,
        'newProfilePicture': userData.profilePicture,
      }))
      return userData;
    } catch (err) {
      if (err.response.status === 404) {
        onAdd('error', newCollaborator);
      }
    }
  }

  return (
    <dialog
      id="formulation_created_modal"
      className={`modal ${isOpen ? 'modal-open' : ''}`}
    >
      <div className="modal-box relative mt-[64px] w-11/12 max-w-md rounded-3xl bg-white md:mt-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute top-4 right-4"
          onClick={onClose}
        >
          <RiCloseLine className="h-5 w-5" />
        </button>

        <h3 className="text-deepbrown mb-2 text-lg font-bold">
          {`Share "${formulation?.name}"`}
        </h3>

        {/* Share section */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Share with others</p>
            <form className="flex flex-1 gap-2" onSubmit={handleNewCollaborator}>
              <input
                type="email"
                name="newEmail"
                placeholder="Add email"
                required
                value={newCollaborator.newEmail}
                onChange={handleChange}
                className="input input-bordered flex-3 rounded-xl text-xs md:text-sm"
              />
              <select
                name="newAccess"
                value={newCollaborator.newAccess}
                onChange={handleChange}
                className="select select-bordered flex-1 rounded-xl text-xs md:text-sm
                ">
                <option value="edit">Can edit</option>
                <option value="view">Can view</option>
              </select>
              <button
                type="submit"
                className="btn bg-green-button rounded-xl px-3 text-white hover:bg-green-600"
              >
                Invite
              </button>
            </form>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Who has access</p>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
              {collaborators?.map((collaborator, collaboratorIndex) => (
                <div className="flex items-center justify-between" key={collaboratorIndex}>
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="h-8 w-8 rounded-full bg-gray-200">
                        <img src={collaborator.profilePicture} alt="" />
                      </div>
                    </div>
                    <span className="text-xs md:text-sm">{collaborator.email}</span>
                  </div>
                  {collaborator.access === 'owner' ? (
                    <span className="text-sm text-gray-500">owner</span>
                  )
                  : (<select className="select select-xs rounded-xl text-sm w-18" value={collaborator.access}>
                      <option value="edit">edit</option>
                      <option value="view">view</option>
                    </select>)
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-outline rounded-xl px-4">
            Copy link
            <MdLink className="h-5 w-5" />
          </button>
          <button className="btn rounded-xl px-4" onClick={onClose}>
            Done
          </button>
        </div>

      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ShareFormulationModal
