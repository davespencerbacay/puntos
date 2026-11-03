import './App.scss'
import Navbar from './layouts/Navbar/Navbar'
import Footer from './layouts/Footer/Footer'
import Home from './pages/home/Home'

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content" aria-label="Main content">
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App
