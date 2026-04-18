import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JoinLeague.scss'
import { leagues } from '../api'

function JoinLeague() {
  const navigate = useNavigate()
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (link.trim() === '') return
    setLoading(true)
    setError('')

    try {
      const code = link.includes('/') ? link.split('/').pop() : link
      const res = await leagues.join({ invite_code: code })
      localStorage.setItem('leagueId', res.data.id)
      localStorage.setItem('leagueName', res.data.name)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'קוד לא תקין')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h2 className="headerTitle">הצטרף לליגה</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <p className="label">הדבק קישור או קוד הזמנה</p>
        <input
          className="input"
          type="text"
          placeholder="biliball.app/join/... או קוד כמו ABC123"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        {error && <p style={{ color: 'red', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        <button className="submitBtn" onClick={handleJoin} disabled={loading}>
          {loading ? 'מצטרף...' : 'הצטרף'}
        </button>
      </div>
    </div>
  )
}

export default JoinLeague