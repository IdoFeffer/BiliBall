import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateLeague from './pages/CreateLeague'
import JoinLeague from './pages/JoinLeague.jsx'
import AddGame from './pages/AddGame'
import Profile from './pages/Profile'
import H2H from './pages/H2H'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-league" element={<CreateLeague />} />
        <Route path="/join-league" element={<JoinLeague />} />
        <Route path="/add-game" element={<AddGame />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/h2h" element={<H2H />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App