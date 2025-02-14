import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
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
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup'

  return (
    <div className="h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && <Sidebar />}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/nutrients" element={<Nutrients />} />
            <Route path="/formulations" element={<Formulations />} />
            <Route path="/formulations/:code" element={<ViewFormulation />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
