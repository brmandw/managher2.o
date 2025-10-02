export function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <path fill="url(#logo-gradient)" d="M10 10h30v30H10z" style={{filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.1))'}} rx="5" />
      <text
        x="48"
        y="32"
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        BizPlan Navigator
      </text>
    </svg>
  );
}
