import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JoinLeague.scss'
import { leagues } from '../api'

function JoinLeague() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('join')

  const [link, setLink] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')

  const [leagueName, setLeagueName] = useState('')
  const [created, setCreated] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

  const handleJoin = async () => {
    if (link.trim() === '') return
    setJoinLoading(true)
    setJoinError('')
    try {
      const code = link.includes('/') ? link.split('/').pop() : link
      const res = await leagues.join({ invite_code: code })
      localStorage.setItem('leagueId', res.data.id)
      localStorage.setItem('leagueName', res.data.name)
      localStorage.setItem('leagueCode', res.data.invite_code)
      const allRes = await leagues.getAllLeagues()
      localStorage.setItem('userLeagues', JSON.stringify(allRes.data))
      navigate('/home')
    } catch (err) {
      setJoinError(err.response?.data?.error || 'קוד לא תקין')
    } finally {
      setJoinLoading(false)
    }
  }

  const handleCreate = async () => {
    if (leagueName.trim() === '') return
    setCreateLoading(true)
    setCreateError('')
    try {
      const res = await leagues.create({ name: leagueName })
      setInviteCode(res.data.invite_code)
      localStorage.setItem('leagueId', res.data.id)
      localStorage.setItem('leagueName', res.data.name)
      localStorage.setItem('leagueCode', res.data.invite_code)
      const allRes = await leagues.getAllLeagues()
      localStorage.setItem('userLeagues', JSON.stringify(allRes.data))
      setCreated(true)
    } catch (err) {
      setCreateError('משהו השתבש')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`biliball.app/join/${inviteCode}`)
    alert('הקישור הועתק!')
  }

  return (
    <div className="page">
      <header className="header">
        <h2 className="headerTitle">ליגות</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="tabsWrapper">
        <button
          className={`tabBtn ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          הצטרף לליגה
        </button>
        <button
          className={`tabBtn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          צור ליגה חדשה
        </button>
      </div>

      {activeTab === 'join' && (
        <div className="section">
          <p className="label">קוד הזמנה</p>
          <input
            className="input"
            type="text"
            placeholder="biliball.app/join/... או קוד כמו ABC123"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          {joinError && (
            <p style={{ color: 'red', fontSize: '13px', marginTop: '8px' }}>
              {joinError}
            </p>
          )}
          <button className="submitBtn" onClick={handleJoin} disabled={joinLoading}>
            {joinLoading ? 'מצטרף...' : 'הצטרף'}
          </button>
        </div>
      )}

      {activeTab === 'create' && (
        <>
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
            {createError && (
              <p style={{ color: 'red', fontSize: '13px' }}>{createError}</p>
            )}
            {!created && (
              <button className="submitBtn" onClick={handleCreate} disabled={createLoading}>
                {createLoading ? 'יוצר...' : 'צור ליגה'}
              </button>
            )}
            {created && (
              <div className="successBanner">✓ הליגה נוצרה! עכשיו הזמן חברים</div>
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
        </>
      )}
    </div>
  )
}

export default JoinLeague