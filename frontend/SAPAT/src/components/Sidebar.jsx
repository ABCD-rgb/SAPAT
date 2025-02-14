import { Link, useLocation } from 'react-router-dom'
import { RiDashboardLine, RiLeafLine, RiStackLine, RiFlaskLine, RiLogoutBoxLine } from 'react-icons/ri'

function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
    { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { path: '/ingredients', icon: RiLeafLine, label: 'Ingredients' },
    { path: '/nutrients', icon: RiStackLine, label: 'Nutrients' },
    { path: '/formulations', icon: RiFlaskLine, label: 'Formulate' },
  ]

  return (
    <div className="bg-green-accent h-full w-16 md:w-48 p-3 flex flex-col">
      <div className="flex justify-center mb-8">
        <img src="/src/assets/logo.png" alt="SAPAT Logo" className="w-10 h-10 md:w-16 md:h-16" />
      </div>
      
      <nav className="space-y-4 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-2 rounded-lg transition-colors
              ${location.pathname === item.path 
                ? 'bg-white text-deepbrown' 
                : 'text-darkbrown hover:bg-white/50'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="hidden md:block ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
        
      <Link
        to="/"
        className="flex items-center p-2 rounded-lg text-red-button hover:bg-white/50 transition-colors"
      >
        <RiLogoutBoxLine className="w-6 h-6" />
        <span className="hidden md:block ml-3">Logout</span>
      </Link>
    </div>
  )
}

export default Sidebar

