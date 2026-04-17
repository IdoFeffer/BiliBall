import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (isRegister) {
      console.log('נרשם:', username, password)
      navigate('/create-league')
    } else {
      console.log('התחבר:', username, password)
      navigate('/home')
    }
  }

  return (
    <div>
      <h1>BiliBall 🎱</h1>

      <h2>{isRegister ? 'הרשמה' : 'התחברות'}</h2>

      <input
        type="text"
        placeholder="שם משתמש"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isRegister && (
        <input
          type="text"
          placeholder="שם מלא"
        />
      )}

      <button onClick={handleSubmit}>
        {isRegister ? 'הירשם' : 'התחבר'}
      </button>

      <p>
        {isRegister ? 'כבר יש לך חשבון?' : 'אין לך חשבון?'}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'התחבר' : 'הירשם'}
        </button>
      </p>
    </div>
  )
}

export default Login