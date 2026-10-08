export default function SceneFallback() {
  return (
    <div className="spectacle-fallback">
      <svg viewBox="0 0 540 320" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="spectacle-lens" x2="1" y2="1">
            <stop stopColor="#a9dbde" stopOpacity=".45" />
            <stop offset="1" stopColor="#eef6f6" stopOpacity=".1" />
          </linearGradient>
        </defs>
        <g stroke="#172b3a" strokeWidth="10" strokeLinejoin="round">
          <path d="M68 124 147 66 237 89M447 155 468 88 377 62" />
          <path d="m222 145 40 8" />
          <rect x="64" y="122" width="157" height="102" rx="29" fill="url(#spectacle-lens)" transform="rotate(6 64 122)" />
          <rect x="263" y="143" width="173" height="105" rx="29" fill="url(#spectacle-lens)" transform="rotate(6 263 143)" />
        </g>
        <rect x="72" y="108" width="50" height="29" rx="9" fill="#096b78" />
        <circle cx="96" cy="123" r="8" fill="#172b3a" stroke="#8bd9db" strokeWidth="3" />
        <rect x="391" y="136" width="47" height="29" rx="8" fill="#172b3a" />
        <circle cx="405" cy="150" r="6" fill="#8bd9db" />
        <circle cx="425" cy="152" r="5" fill="#096b78" />
        <path d="m88 155 90 10m109 17 102 11" stroke="white" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
