import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Ingredients from './pages/Ingredients';
import Nutrients from './pages/Nutrients';
import Formulations from './pages/Formulations';
import ViewFormulation from './pages/ViewFormulation';
import Error from './pages/Error';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/nutrients" element={<Nutrients />} />
          <Route path="/formulations" element={<Formulations />} />
          <Route path="/view-formulation" element={<ViewFormulation />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
