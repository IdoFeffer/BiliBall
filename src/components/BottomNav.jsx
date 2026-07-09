import { useNavigate } from 'react-router-dom'
import '../styles/BottomNav.scss'

// DOM order is RTL: first child = visual right. Order: פרופיל | לוח | FAB | ראש בראש | בית
function BottomNav({ active }) {
  const navigate = useNavigate()

  return (
    <nav className="appNav">
      <button
        className={`appNavTab ${active === 'profile' ? 'appNavActive' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <span className="appNavIcon">👤</span>
        <span className="appNavLabel">פרופיל</span>
      </button>

      <button
        className={`appNavTab ${active === 'bulletin' ? 'appNavActive' : ''}`}
        onClick={() => navigate('/bulletin')}
      >
        <span className="appNavIcon">📢</span>
        <span className="appNavLabel">לוח</span>
      </button>

      <button
        className={`appNavFabWrap ${active === 'game' ? 'appNavActive' : ''}`}
        onClick={() => navigate('/add-game')}
      >
        <div className="appNavFab">+</div>
        <span className="appNavFabLabel">משחק</span>
      </button>

      <button
        className={`appNavTab ${active === 'h2h' ? 'appNavActive' : ''}`}
        onClick={() => navigate('/h2h')}
      >
        <span className="appNavIcon">⚔️</span>
        <span className="appNavLabel">ראש בראש</span>
      </button>

      <button
        className={`appNavTab ${active === 'home' ? 'appNavActive' : ''}`}
        onClick={() => navigate('/home')}
      >
        <span className="appNavIcon">🏠</span>
        <span className="appNavLabel">בית</span>
      </button>
    </nav>
  )
}

export default BottomNav
