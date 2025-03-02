import { RiCloseLine } from 'react-icons/ri'
import { MdLink } from "react-icons/md";


function ShareFormulationModal({ isOpen, onClose, formulation, collaborators }) {

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
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                placeholder="Add people"
                className="input input-bordered flex-3 rounded-xl"
              />
              <select className="select select-bordered flex-1 rounded-xl text-sm">
                <option value="edit">Can edit</option>
                <option value="view">Can view</option>
              </select>
              <button className="btn bg-green-button rounded-xl px-3 text-white hover:bg-green-600">
                Invite
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Who has access</p>
            <div className="space-y-3">
              {collaborators?.map((collaborator, collaboratorIndex) => (
                <div className="flex items-center justify-between" key={collaboratorIndex}>
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="h-8 w-8 rounded-full bg-gray-200">
                        {/* Avatar image would go here */}
                        <img src={collaborator.profilePicture} alt="" />
                      </div>
                    </div>
                    <span className="text-sm">{collaborator.email}</span>
                  </div>
                  <span className="text-sm text-gray-500">{collaborator.access}</span>
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
