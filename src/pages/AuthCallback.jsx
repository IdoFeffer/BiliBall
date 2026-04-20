import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { leagues } from '../api'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const user = params.get('user')

    if (token && user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', user)

      leagues
        .getUserLeague()
        .then((res) => {
          if (res.data) {
            localStorage.setItem('leagueId', res.data.id)
            localStorage.setItem('leagueName', res.data.name)
            localStorage.setItem('leagueCode', res.data.invite_code)
          }
          return leagues.getAllLeagues()
        })
        .then((res) => {
          localStorage.setItem('userLeagues', JSON.stringify(res.data))
          navigate('/home')
        })
        .catch(() => {
          navigate('/home')
        })
    } else {
      navigate('/login')
    }
  }, [])

  return <div style={{ padding: 20 }}>מתחבר...</div>
}

export default AuthCallback
