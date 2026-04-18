import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreateLeague.scss'
import { leagues } from '../api'

function CreateLeague() {
  const navigate = useNavigate()
  const [leagueName, setLeagueName] = useState('')
  const [created, setCreated] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (leagueName.trim() === '') return
    setLoading(true)
    try {
      const res = await leagues.create({ name: leagueName })
      setInviteCode(res.data.invite_code)
      localStorage.setItem('leagueId', res.data.id)
      localStorage.setItem('leagueName', res.data.name)
      setCreated(true)
    } catch (err) {
      setError('משהו השתבש')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`biliball.app/join/${inviteCode}`)
    alert('הקישור הועתק!')
  }

  return (
    <div className="page">
      <header className="header">
        <button className="backBtn" onClick={() => navigate('/home')}>← חזרה</button>
        <h2 className="headerTitle">צור ליגה</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <p className="label">שם הליגה</p>
        <input
          className="input"
          type="text"
          placeholder="ליגת המרתף 🎱"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          disabled={created}
        />
        {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
        {!created && (
          <button className="submitBtn" onClick={handleCreate} disabled={loading}>
            {loading ? 'יוצר...' : 'צור ליגה'}
          </button>
        )}
        {created && (
          <div className="successBanner">
            ✓ הליגה נוצרה! עכשיו הזמן חברים
          </div>
        )}
      </div>

      {created && (
        <>
          <div className="section">
            <p className="sectionTitle">הזמן חברים</p>
            <div className="linkBox">
              <span className="linkText">biliball.app/join/{inviteCode}</span>
              <button className="copyBtn" onClick={handleCopy}>העתק</button>
            </div>
            <div className="shareButtons">
              <button className="shareBtn">📱 וואטסאפ</button>
              <button className="shareBtn">✉️ SMS</button>
            </div>
          </div>

          <div className="section">
            <p className="sectionTitle">{leagueName} — חברים</p>
            <div className="memberRow">
              <div className="avatar">
                {JSON.parse(localStorage.getItem('user') || '{}').full_name?.[0]}
              </div>
              <span className="memberName">
                {JSON.parse(localStorage.getItem('user') || '{}').full_name}
              </span>
              <span className="badge admin">מנהל</span>
            </div>
            <div className="memberRow">
              <div className="avatar dim">?</div>
              <span className="memberName muted">ממתין להצטרפות</span>
              <span className="badge pending">ממתין</span>
            </div>
          </div>

          <button className="enterBtn" onClick={() => navigate('/home')}>
            כנס לליגה
          </button>
        </>
      )}
    </div>
  )
}

export default CreateLeague