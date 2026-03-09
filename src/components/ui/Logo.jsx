export default function Logo({ size = 32, withText = true, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="19" fill="#f97316" />
        <path
          d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C23.5 30 26.6 28.2 28.5 25.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M28.5 25.5L26 22L31.5 21.5L28.5 25.5Z" fill="white" />
        <circle cx="20" cy="20" r="3" fill="white" />
      </svg>
      {withText && (
        <span
          style={{
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '-0.02em',
            color: light ? 'white' : '#1c1917',
          }}
        >
          Loyalty <span style={{ color: '#f97316' }}>Loop</span>
        </span>
      )}
    </div>
  );
}
