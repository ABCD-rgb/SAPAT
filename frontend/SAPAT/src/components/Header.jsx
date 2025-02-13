function Header() {
  return (
    //  header containing date (month, day, year) and time on the  leftmost side and a default profile icon on the rightmost side
    <header className="bg-white p-4 shadow-sm">
      <div className="text-darkbrown flex items-center justify-between">
        <div className="items-left border-darkbrown ml-6 flex flex-col border-b pb-2">
          <p className="text-xl font-bold">{new Date().toLocaleTimeString()}</p>
          <p className="text-lg">
            {' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="mr-6 flex items-center">
          <p className="hidden md:mr-10 md:block md:text-2xl md:font-bold">
            John Doe
          </p>
          <img
            className="h-14 w-14 rounded-2xl"
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
    </header>
  )
}

export default Header
