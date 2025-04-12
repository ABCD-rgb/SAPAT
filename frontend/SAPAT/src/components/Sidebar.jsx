import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine,
  RiLeafLine,
  RiStackLine,
  RiFlaskLine,
  RiLogoutBoxLine,
} from 'react-icons/ri'
import useAuth from '../hook/useAuth'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { path: '/ingredients', icon: RiLeafLine, label: 'Ingredients' },
    { path: '/nutrients', icon: RiStackLine, label: 'Nutrients' },
    { path: '/formulations', icon: RiFlaskLine, label: 'Formulate' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="bg-green-accent flex h-full w-16 flex-col p-3 md:w-48">
      <div className="mb-8 flex justify-center">
        <img
          src="/assets/logo.png"
          alt="SAPAT Logo"
          className="h-10 w-10 md:h-16 md:w-16"
        />
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center rounded-lg p-2 transition-colors ${
              location.pathname === item.path
                ? 'text-deepbrown bg-white'
                : 'text-darkbrown hover:bg-white/50'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="ml-3 hidden md:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pb-10 md:pl-2">
        <button
          onClick={handleLogout}
          className="text-red-button hover:bg-red-button flex items-center rounded-lg p-2 transition-colors hover:text-white md:px-4"
        >
          <RiLogoutBoxLine className="h-6 w-6" />
          <span className="ml-3 hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
