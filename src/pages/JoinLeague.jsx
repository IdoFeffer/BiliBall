import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JoinLeague.scss'

const mockMembers = [
  { id: 1, name: 'יוסי', role: 'admin' },
  { id: 2, name: 'דני', role: 'joined' },
  { id: 3, name: '?', role: 'pending' },
]

function JoinLeague() {
  const navigate = useNavigate()
  const [link, setLink] = useState('')

  const handleJoin = () => {
    if (link.trim() === '') return
    navigate('/home')
  }

  return (
    <div className="page">
      <header className="header">
        <button className="backBtn" onClick={() => navigate('/login')}>← חזרה</button>
        <h2 className="headerTitle">הצטרף לליגה</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <p className="label">הדבק קישור הזמנה</p>
        <input
          className="input"
          type="text"
          placeholder="biliball.app/join/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button className="submitBtn" onClick={handleJoin}>הצטרף</button>
      </div>

      <div className="section">
        <p className="sectionTitle">ליגת המרתף — חברים</p>
        {mockMembers.map(member => (
          <div key={member.id} className="memberRow">
            <div className={`avatar ${member.role === 'joined' ? 'green' : member.role === 'pending' ? 'dim' : ''}`}>
              {member.name[0]}
            </div>
            <span className={`memberName ${member.role === 'pending' ? 'muted' : ''}`}>
              {member.role === 'pending' ? 'ממתין להצטרפות' : member.name}
            </span>
            <span className={`badge ${member.role}`}>
              {member.role === 'admin' ? 'מנהל' : member.role === 'joined' ? 'מחובר' : 'ממתין'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JoinLeague