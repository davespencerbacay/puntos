import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'

import './App.scss'

// Portal pages
import Dashboard from './pages/portal/dashboard/Dashboard'

// Layouts
import PublicWrapper from './layouts/PublicWrapper/PublicWrapper'
import PrivateWrapper from './layouts/PrivateWrapper/PrivateWrapper'

const App = () => {
  return (
    <div className="app-shell">
      <Routes>
        {/* Public website */}
        <Route
          path="/"
          element={<PublicWrapper component={<Home />} />}
        />

        {/* Customer portal */}
        <Route path="/portal" element={<PrivateWrapper component={<Dashboard />} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
