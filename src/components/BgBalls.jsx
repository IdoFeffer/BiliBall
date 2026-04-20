function BgBalls() {
  return (
    <svg
      className="bgSvg"
      viewBox="0 0 320 520"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* מקל שמאל קדמי */}
      <g opacity="0.55" transform="rotate(-44, 80, 260)">
        <rect x="76" y="80" width="8" height="180" rx="4" fill="#56351E" />
        <rect x="76" y="258" width="8" height="20" rx="2" fill="#C47335" />
        <rect x="77" y="278" width="6" height="6" rx="1" fill="#777" />
      </g>

      {/* מקל שמאל אחורי */}
      <g opacity="0.35" transform="rotate(-52, 55, 260)">
        <rect x="52" y="80" width="6" height="175" rx="3" fill="#56351E" />
        <rect x="52" y="253" width="6" height="18" rx="2" fill="#C47335" />
      </g>

      {/* מקל ימין קדמי */}
      <g opacity="0.55" transform="rotate(44, 240, 260)">
        <rect x="236" y="80" width="8" height="180" rx="4" fill="#56351E" />
        <rect x="236" y="258" width="8" height="20" rx="2" fill="#C47335" />
        <rect x="237" y="278" width="6" height="6" rx="1" fill="#777" />
      </g>

      {/* מקל ימין אחורי */}
      <g opacity="0.35" transform="rotate(52, 265, 260)">
        <rect x="262" y="80" width="6" height="175" rx="3" fill="#56351E" />
        <rect x="262" y="253" width="6" height="18" rx="2" fill="#C47335" />
      </g>

      {/* כדורים מלאים פינה שמאל עליון */}
      <circle cx="22" cy="22" r="18" fill="#e74c3c" opacity="0.8" />
      <circle cx="22" cy="22" r="8" fill="white" opacity="0.9" />
      <text
        x="22"
        y="26"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#c0392b"
        opacity="0.9"
      >
        3
      </text>

      <circle cx="58" cy="52" r="18" fill="#2660A4" opacity="0.8" />
      <circle cx="58" cy="52" r="8" fill="white" opacity="0.9" />
      <text
        x="58"
        y="56"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#1a4a80"
        opacity="0.9"
      >
        2
      </text>

      {/* כדורים מלאים פינה ימין עליון */}
      <circle cx="298" cy="22" r="18" fill="#F19953" opacity="0.8" />
      <circle cx="298" cy="22" r="8" fill="white" opacity="0.9" />
      <text
        x="298"
        y="26"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#C47335"
        opacity="0.9"
      >
        5
      </text>

      <circle cx="262" cy="52" r="18" fill="#16a34a" opacity="0.8" />
      <circle cx="262" cy="52" r="8" fill="white" opacity="0.9" />
      <text
        x="262"
        y="56"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#0d5c2a"
        opacity="0.9"
      >
        6
      </text>

      {/* כדורים מפוספסים פינה שמאל תחתון */}
      <circle cx="22" cy="478" r="18" fill="white" opacity="0.8" />
      <rect x="4" y="471" width="36" height="14" fill="#e74c3c" opacity="0.8" />
      <circle
        cx="22"
        cy="478"
        r="18"
        fill="none"
        stroke="#e74c3c"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="22" cy="478" r="8" fill="white" opacity="0.9" />
      <text
        x="22"
        y="482"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#c0392b"
        opacity="0.9"
      >
        11
      </text>

      <circle cx="58" cy="448" r="18" fill="white" opacity="0.8" />
      <rect
        x="40"
        y="441"
        width="36"
        height="14"
        fill="#2660A4"
        opacity="0.8"
      />
      <circle
        cx="58"
        cy="448"
        r="18"
        fill="none"
        stroke="#2660A4"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="58" cy="448" r="8" fill="white" opacity="0.9" />
      <text
        x="58"
        y="452"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#1a4a80"
        opacity="0.9"
      >
        10
      </text>

      {/* כדורים מפוספסים פינה ימין תחתון */}
      <circle cx="298" cy="478" r="18" fill="white" opacity="0.8" />
      <rect
        x="280"
        y="471"
        width="36"
        height="14"
        fill="#F19953"
        opacity="0.8"
      />
      <circle
        cx="298"
        cy="478"
        r="18"
        fill="none"
        stroke="#F19953"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="298" cy="478" r="8" fill="white" opacity="0.9" />
      <text
        x="298"
        y="482"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#C47335"
        opacity="0.9"
      >
        13
      </text>

      <circle cx="262" cy="448" r="18" fill="white" opacity="0.8" />
      <rect
        x="244"
        y="441"
        width="36"
        height="14"
        fill="#16a34a"
        opacity="0.8"
      />
      <circle
        cx="262"
        cy="448"
        r="18"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="262" cy="448" r="8" fill="white" opacity="0.9" />
      <text
        x="262"
        y="452"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#0d5c2a"
        opacity="0.9"
      >
        14
      </text>

      {/* כדור 8 */}
      <circle cx="160" cy="496" r="20" fill="#1a1a1a" opacity="0.8" />
      <circle cx="160" cy="496" r="9" fill="white" opacity="0.9" />
      <text
        x="160"
        y="500"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="#1a1a1a"
        opacity="0.9"
      >
        8
      </text>
    </svg>
  )
}

export default BgBalls
