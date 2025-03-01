import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Ingredients from './pages/Ingredients'
import Nutrients from './pages/Nutrients'
import Formulations from './pages/Formulations'
import ViewFormulation from './pages/ViewFormulation'
import Error from './pages/Error'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

function AppLayout() {
  const location = useLocation()
  const isAuthPage =
    location.pathname === '/'

  return (
    <div className="flex h-screen flex-col">
      {!isAuthPage && <Header />}
      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && <Sidebar />}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/ingredients',
        element: <Ingredients />,
      },
      {
        path: '/nutrients',
        element: <Nutrients />,
      },
      {
        path: '/formulations',
        element: <Formulations />,
      },
      {
        path: '/formulations/:id',
        element: <ViewFormulation />,
      },
      {
        path: '/error',
        element: <Error />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
