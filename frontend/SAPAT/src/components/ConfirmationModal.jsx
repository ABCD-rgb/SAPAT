import { RiCloseLine } from 'react-icons/ri'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, description }) {
  return (
    <dialog id="confirmation_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-md bg-white rounded-3xl relative mt-[64px] md:mt-0">
        {/* Close button */}
        <button 
          className="btn btn-sm btn-circle absolute right-4 top-4"
          onClick={onClose}
        >
          <RiCloseLine className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-lg text-deepbrown mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        {/* Modal actions */}
        <div className="modal-action">
          <button 
            className="btn rounded-xl px-8" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn bg-red-500 hover:bg-red-600 text-white rounded-xl px-8"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ConfirmationModal
