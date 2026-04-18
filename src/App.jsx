import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateLeague from './pages/CreateLeague'
import JoinLeague from './pages/JoinLeague'
import AddGame from './pages/AddGame'
import Profile from './pages/Profile'
import H2H from './pages/H2H'

const PAGES_WITH_BACK = ['/profile', '/h2h', '/create-league', '/join-league', '/add-game']

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()

  const showBack = PAGES_WITH_BACK.some(p => location.pathname.startsWith(p))
  if (!showBack) return null

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: 'fixed',
        top: '12px',
        right: '16px',
        zIndex: 999,
        padding: '6px 10px',
        borderRadius: '999px',
        border: '1px solid #ccc',
        background: '#fff',
        color: '#1a1a1a',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      →
    </button>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDark = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark')
  }

  return (
    <BrowserRouter>
      <button
        onClick={toggleDark}
        style={{
          position: 'fixed',
          top: '12px',
          left: '16px',
          zIndex: 999,
          padding: '6px 10px',
          borderRadius: '999px',
          border: '1px solid #ccc',
          background: darkMode ? '#2d2640' : '#fff',
          color: darkMode ? '#CCE2A3' : '#1a1a1a',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <BackButton />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-league" element={<CreateLeague />} />
        <Route path="/join-league" element={<JoinLeague />} />
        <Route path="/add-game" element={<AddGame />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/h2h" element={<H2H />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App