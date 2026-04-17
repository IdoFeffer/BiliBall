import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.scss'

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (isRegister) {
      console.log('נרשם:', username, password)
      navigate('/home')
    } else {
      console.log('התחבר:', username, password)
      navigate('/home')
    }
  }

  return (
    <div className="page">
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
            <input className="input" type="text" placeholder="שם מלא" />
          )}
        </div>

        <button className="submitBtn" onClick={handleSubmit}>
          {isRegister ? 'הירשם' : 'התחבר'}
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
