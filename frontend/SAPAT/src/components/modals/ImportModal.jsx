import {RiCloseLine} from "react-icons/ri";

function ImportModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  return (
    <dialog
      id="import_modal"
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

        {/* Main Content */}
        <h3 className="text-deepbrown mb-2 text-lg font-bold">
          Import
        </h3>
        <p className="text-sm text-gray-500">Drop your excel file here or click to browse.</p>
        <p className="mb-4 text-sm text-gray-500">
          <a
            href="https://docs.google.com/spreadsheets/d/1HlvtEnW_UaPQPQ9lNgTyobvrrr6o1Q9g/edit?usp=sharing&ouid=103933737847328450424&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          > View template </a>
           for required format.
        </p>

        <div className="flex py-4">
          <fieldset className="fieldset">
            <input type="file" accept='.xlsx' className="file-input file-input-ghost" />
          </fieldset>
        </div>

        {/* Modal actions */}
        <div className="modal-action">
          <button className="btn rounded-xl px-8" onClick={onClose}>
            Cancel
          </button>
            <button
              className="btn rounded-xl bg-amber-500 px-8 text-white hover:bg-amber-600"
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              Import
            </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default ImportModal;