function ProfileSkeleton() {
  return (
    <>
      <style>{`
        @keyframes psk-wave {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .psk {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: psk-wave 1.6s ease-in-out infinite;
          border-radius: 6px;
        }
      `}</style>

      <div style={{ background: '#F4F8FF', minHeight: '100vh', direction: 'rtl', paddingBottom: 80 }}>

        {/* ── Dark gradient header ── */}
        <div style={{
          background: 'linear-gradient(180deg, #1B4FD8 0%, #1E56DE 55%, #F4F8FF 100%)',
          paddingTop: 56,
          paddingBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />
          <div style={{ width: 120, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.22)' }} />
          <div style={{ width: 76, height: 11, borderRadius: 8, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div style={{ padding: '0 16px' }}>

          {/* ── Hero card: ring section | divider | diff section ── */}
          <div style={{
            background: 'white',
            borderRadius: 22,
            padding: '20px 18px',
            boxShadow: '0 14px 30px rgba(15,34,64,.10)',
            display: 'flex',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            {/* אחוז ניצחון – ring + label */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div className="psk" style={{ width: 82, height: 82, borderRadius: '50%' }} />
              <div className="psk" style={{ width: 64, height: 11 }} />
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 66, background: '#E9EEF6', margin: '0 12px', flexShrink: 0 }} />

            {/* מד' – differential number + label */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="psk" style={{ width: 48, height: 28, borderRadius: 8 }} />
              <div className="psk" style={{ width: 28, height: 11 }} />
            </div>
          </div>

          {/* ── Three-stat row: נצחונות / הפסדים / רצף ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: 1,
                background: 'white',
                borderRadius: 16,
                padding: '14px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(15,34,64,.07)',
              }}>
                <div className="psk" style={{ width: 36, height: 22, borderRadius: 6 }} />
                <div className="psk" style={{ width: 44, height: 9 }} />
              </div>
            ))}
          </div>

          {/* ── History card ── */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '18px 16px',
            boxShadow: '0 4px 16px rgba(15,34,64,.08)',
          }}>
            {/* Section title */}
            <div className="psk" style={{ width: 110, height: 14, marginBottom: 16 }} />

            {/* Game rows: badge (right) | text | date (left) */}
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid #F0F4FA' : 'none',
              }}>
                <div className="psk" style={{ width: 46, height: 22, borderRadius: 99, flexShrink: 0 }} />
                <div className="psk" style={{ flex: 1, height: 12 }} />
                <div className="psk" style={{ width: 48, height: 10, flexShrink: 0 }} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

export default ProfileSkeleton
