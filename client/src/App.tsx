import './App.scss'
import Navbar from './layouts/Navbar/Navbar'
import Home from './pages/home/Home'

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content" aria-label="Main content">
        <Home />
      </main>
    </div>
  )
}

export default App
