import React from 'react'

export function Mark({ size = 22, color = '#14151A' }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size, background: color, borderRadius: Math.round(size * 0.28) }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path d="M3.6 3.2v9.6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M7.1 3.2v9.6" stroke="#fff" strokeWidth="1.15" strokeLinecap="round" />
        <circle cx="10.9" cy="6.2" r="1.15" fill="#fff" />
        <circle cx="10.9" cy="9.8" r="1.15" fill="#fff" />
      </svg>
    </span>
  )
}

export function Wordmark() {
  return (
    <span className="brand">
      <Mark size={22} />
      <span className="wordmark">Matchmaking</span>
    </span>
  )
}

export function Tile({ initials, accent = '#14151A', size = 24 }) {
  return (
    <span className="mono-tile" style={{ width: size, height: size, background: accent, fontSize: size * 0.38 }}>
      {initials}
    </span>
  )
}
