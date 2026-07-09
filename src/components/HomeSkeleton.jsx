function HomeSkeleton() {
  return (
    <>
      <style>{`
        @keyframes hsk-wave {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .hsk {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: hsk-wave 1.6s ease-in-out infinite;
          border-radius: 6px;
        }
      `}</style>

      <div style={{ background: '#F4F8FF', minHeight: '100vh', direction: 'rtl', paddingBottom: 80 }}>

        {/* ── HEADER ── */}
        <nav style={{
          background: 'linear-gradient(135deg, #1e3a8a, #1b4fd8)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Ball8 button placeholder (visual right in RTL) */}
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
          {/* Center: title + league chip */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 88, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.25)' }} />
            <div style={{ width: 80, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.15)' }} />
          </div>
          {/* Dark toggle placeholder (visual left in RTL) */}
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
        </nav>

        <div style={{ padding: '12px 12px 0' }}>

          {/* ── HERO CARD ── */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '16px',
            boxShadow: '0 8px 24px rgba(15,34,64,.10)',
            marginBottom: 12,
          }}>
            {/* Avatar (right in RTL) + name/subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div className="hsk" style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div className="hsk" style={{ width: 110, height: 16 }} />
                <div className="hsk" style={{ width: 74, height: 11 }} />
              </div>
            </div>
            {/* 3 stat boxes */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  flex: 1,
                  background: '#F8FAFC',
                  borderRadius: 12,
                  padding: '10px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <div className="hsk" style={{ width: 34, height: 18, borderRadius: 5 }} />
                  <div className="hsk" style={{ width: 42, height: 9 }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── LEADERBOARD ── */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 14px rgba(15,34,64,.07)',
            marginBottom: 12,
            overflow: 'hidden',
          }}>
            {/* Column headers */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#F8FAFC',
              borderBottom: '1px solid #EEF2F8',
              gap: 8,
            }}>
              {/* "שחקן" label placeholder — takes remaining space on the right in RTL */}
              <div className="hsk" style={{ flex: 1, height: 9, maxWidth: 44 }} />
              <div style={{ flex: 1 }} />
              {/* 3 stat header bars */}
              {[0, 1, 2].map(i => (
                <div key={i} className="hsk" style={{ width: 22, height: 9, flexShrink: 0 }} />
              ))}
            </div>

            {/* 4 player rows */}
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderBottom: i < 3 ? '1px solid #F0F4FA' : 'none',
              }}>
                {/* Rank circle (far right in RTL) */}
                <div className="hsk" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }} />
                {/* Avatar circle */}
                <div className="hsk" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
                {/* Name bar */}
                <div className="hsk" style={{ flex: 1, height: 11, maxWidth: 110 }} />
                <div style={{ flex: 1 }} />
                {/* 3 stat bars */}
                {[0, 1, 2].map(j => (
                  <div key={j} className="hsk" style={{ width: 22, height: 11, borderRadius: 4, flexShrink: 0 }} />
                ))}
              </div>
            ))}
          </div>

          {/* ── RECENT GAMES ── */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 14px rgba(15,34,64,.07)',
            marginBottom: 12,
          }}>
            {/* Section header: total count (left) + title (right) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px 10px',
            }}>
              <div className="hsk" style={{ width: 48, height: 9 }} />
              <div className="hsk" style={{ width: 88, height: 14 }} />
            </div>

            {/* 3 game rows: date | score-pill | text | avatar-circle */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderTop: '1px solid #F0F4FA',
                direction: 'ltr',
              }}>
                {/* Date (far left) */}
                <div className="hsk" style={{ width: 38, height: 10, flexShrink: 0 }} />
                {/* Score pill */}
                <div className="hsk" style={{ width: 50, height: 22, borderRadius: 99, flexShrink: 0 }} />
                {/* Result text */}
                <div className="hsk" style={{ flex: 1, height: 11 }} />
                {/* Winner avatar (far right) */}
                <div className="hsk" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

export default HomeSkeleton
