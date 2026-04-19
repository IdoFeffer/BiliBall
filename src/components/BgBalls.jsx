function BgBalls() {
  return (
    <svg
      className="bgSvg"
      viewBox="0 0 320 280"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* מקל שמאל אחורי */}
      <g opacity="0.8" transform="rotate(-52, 45, 140)">
        <rect x="41" y="-30" width="7" height="200" rx="3" fill="#56351E" />
        <rect x="41" y="168" width="7" height="22" rx="2" fill="#C47335" />
        <rect x="42" y="190" width="5" height="6" rx="1" fill="#888" />
      </g>
      {/* מקל שמאל קדמי */}
      <g opacity="0.8" transform="rotate(-44, 65, 140)">
        <rect x="61" y="-30" width="9" height="205" rx="4" fill="#56351E" />
        <rect x="61" y="173" width="9" height="24" rx="2" fill="#C47335" />
        <rect x="62" y="197" width="7" height="7" rx="1" fill="#777" />
      </g>
      {/* מקל ימין אחורי */}
      <g opacity="0.8" transform="rotate(52, 275, 140)">
        <rect x="272" y="-30" width="7" height="200" rx="3" fill="#56351E" />
        <rect x="272" y="168" width="7" height="22" rx="2" fill="#C47335" />
        <rect x="273" y="190" width="5" height="6" rx="1" fill="#888" />
      </g>
      {/* מקל ימין קדמי */}
      <g opacity="0.8" transform="rotate(44, 255, 140)">
        <rect x="250" y="-30" width="9" height="205" rx="4" fill="#56351E" />
        <rect x="250" y="173" width="9" height="24" rx="2" fill="#C47335" />
        <rect x="251" y="197" width="7" height="7" rx="1" fill="#777" />
      </g>

      {/* כדורים מלאים למעלה */}
      <circle cx="55" cy="35" r="18" fill="#e74c3c" opacity="0.8" />
      <circle cx="55" cy="35" r="8" fill="white" opacity="0.8" />
      <text
        x="55"
        y="39"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#c0392b"
        opacity="0.8"
      >
        3
      </text>

      <circle cx="100" cy="52" r="18" fill="#2660A4" opacity="0.8" />
      <circle cx="100" cy="52" r="8" fill="white" opacity="0.8" />
      <text
        x="100"
        y="56"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#1a4a80"
        opacity="0.8"
      >
        2
      </text>

      <circle cx="220" cy="35" r="18" fill="#F19953" opacity="0.8" />
      <circle cx="220" cy="35" r="8" fill="white" opacity="0.8" />
      <text
        x="220"
        y="39"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#C47335"
        opacity="0.8"
      >
        5
      </text>

      <circle cx="265" cy="52" r="18" fill="#16a34a" opacity="0.8" />
      <circle cx="265" cy="52" r="8" fill="white" opacity="0.8" />
      <text
        x="265"
        y="56"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#0d5c2a"
        opacity="0.8"
      >
        6
      </text>

      {/* כדורים מפוספסים למטה */}
      <circle cx="55" cy="238" r="18" fill="white" opacity="0.8" />
      <rect
        x="37"
        y="231"
        width="36"
        height="14"
        fill="#e74c3c"
        opacity="0.8"
      />
      <circle
        cx="55"
        cy="238"
        r="18"
        fill="none"
        stroke="#e74c3c"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="55" cy="238" r="8" fill="white" opacity="0.8" />
      <text
        x="55"
        y="242"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#c0392b"
        opacity="0.8"
      >
        11
      </text>

      <circle cx="100" cy="222" r="18" fill="white" opacity="0.8" />
      <rect
        x="82"
        y="215"
        width="36"
        height="14"
        fill="#2660A4"
        opacity="0.8"
      />
      <circle
        cx="100"
        cy="222"
        r="18"
        fill="none"
        stroke="#2660A4"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="100" cy="222" r="8" fill="white" opacity="0.8" />
      <text
        x="100"
        y="226"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#1a4a80"
        opacity="0.8"
      >
        10
      </text>

      <circle cx="220" cy="238" r="18" fill="white" opacity="0.8" />
      <rect
        x="202"
        y="231"
        width="36"
        height="14"
        fill="#F19953"
        opacity="0.8"
      />
      <circle
        cx="220"
        cy="238"
        r="18"
        fill="none"
        stroke="#F19953"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="220" cy="238" r="8" fill="white" opacity="0.8" />
      <text
        x="220"
        y="242"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#C47335"
        opacity="0.8"
      >
        13
      </text>

      <circle cx="265" cy="222" r="18" fill="white" opacity="0.8" />
      <rect
        x="247"
        y="215"
        width="36"
        height="14"
        fill="#16a34a"
        opacity="0.8"
      />
      <circle
        cx="265"
        cy="222"
        r="18"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="265" cy="222" r="8" fill="white" opacity="0.8" />
      <text
        x="265"
        y="226"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#0d5c2a"
        opacity="0.8"
      >
        14
      </text>

      {/* כדור 8 */}
      <circle cx="160" cy="252" r="20" fill="#1a1a1a" opacity="0.8" />
      <circle cx="160" cy="252" r="9" fill="white" opacity="0.8" />
      <text
        x="160"
        y="256"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="#1a1a1a"
        opacity="0.8"
      >
        8
      </text>
    </svg>
  )
}

export default BgBalls
