import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.scss'
import { auth, leagues } from '../api'
import BgBalls from '../components/BgBalls'

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      let res
      if (isRegister) {
        res = await auth.register({ username, password, full_name: fullName })
      } else {
        res = await auth.login({ username, password })
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      try {
        const leagueRes = await leagues.getUserLeague()
        if (leagueRes.data) {
          localStorage.setItem('leagueId', leagueRes.data.id)
          localStorage.setItem('leagueName', leagueRes.data.name)
          localStorage.setItem('leagueCode', leagueRes.data.invite_code)
        }

        const allRes = await leagues.getAllLeagues()
        localStorage.setItem('userLeagues', JSON.stringify(allRes.data))
      } catch {
        // אין ליגה
      }

      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'משהו השתבש')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <BgBalls />
      <h1 className="logo">BiliBall 🎱</h1>
      <p className="subtitle">עקוב אחר הניצחונות שלך</p>

      <div className="card">
        <h2 className="title">{isRegister ? 'הרשמה' : 'התחברות'}</h2>

        <div className="inputGroup">
          <input
            className="input"
            type="text"
            placeholder="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegister && (
            <input
              className="input"
              type="text"
              placeholder="שם מלא"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
        </div>

        {error && (
          <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>
            {error}
          </p>
        )}

        <button className="submitBtn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'טוען...' : isRegister ? 'הירשם' : 'התחבר'}
        </button>

        <p className="switchText">
          {isRegister ? 'כבר יש לך חשבון?' : 'אין לך חשבון?'}
          <button
            className="switchBtn"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'התחבר' : 'הירשם'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
