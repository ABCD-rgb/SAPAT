import { RiCloseLine } from 'react-icons/ri'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, description }) {
  return (
    <dialog
      id="confirmation_modal"
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

        <h3 className="text-deepbrown mb-2 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{description}</p>

        {/* Modal actions */}
        <div className="modal-action">
          <button className="btn rounded-xl px-8" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn rounded-xl bg-red-500 px-8 text-white hover:bg-red-600"
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
