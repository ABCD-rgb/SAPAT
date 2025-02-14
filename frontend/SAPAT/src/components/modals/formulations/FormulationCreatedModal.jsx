import { RiCloseLine, RiGlobalLine } from 'react-icons/ri'

function FormulationCreatedModal({ isOpen, onClose, formulation }) {
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
          Formulation created!
        </h3>
        <p className="mb-6 text-sm text-gray-600">
          {formulation?.description || 'No description'}
        </p>

        {/* Share section */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Share with others</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add people"
                className="input input-bordered flex-1 rounded-xl"
              />
              <button className="btn bg-green-button rounded-xl px-4 text-white hover:bg-green-600">
                Invite
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Who has access</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <RiGlobalLine className="h-5 w-5" />
                <select className="select select-bordered flex-1 rounded-xl text-sm">
                  <option>Anyone with the link (can view)</option>
                  <option>Anyone with the link (can edit)</option>
                  <option>Restricted</option>
                </select>
              </div>

              {/* Owner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="h-8 w-8 rounded-full bg-gray-200">
                      {/* Avatar image would go here */}
                    </div>
                  </div>
                  <span className="text-sm">Kristine Star</span>
                </div>
                <span className="text-sm text-gray-500">owner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-outline rounded-xl px-6">Copy link</button>
          <button className="btn bg-green-button rounded-xl px-6 text-white hover:bg-green-600">
            Open file
          </button>
          <button className="btn rounded-xl px-6" onClick={onClose}>
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

export default FormulationCreatedModal
