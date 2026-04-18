import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateLeague from './pages/CreateLeague'
import JoinLeague from './pages/JoinLeague'
import AddGame from './pages/AddGame'
import Profile from './pages/Profile'
import H2H from './pages/H2H'

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
