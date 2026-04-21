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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'https://biliball.onrender.com/api'}/auth/google`
  }

  return (
    <div className="page">
      <BgBalls />
      <div className="card">
        <h1 className="logo">BiliBall 🎱</h1>
        <p className="subtitle">עקוב אחר הניצחונות שלך</p>
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
        <div className="divider">
          <div className="dividerLine" />
          <span className="dividerText">או</span>
          <div className="dividerLine" />
        </div>
        <button className="googleBtn" onClick={handleGoogleLogin} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          המשך עם Google
        </button>
      </div>
    </div>
  )
}

export default Login
