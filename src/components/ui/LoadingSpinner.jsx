export default function LoadingSpinner({ size = 'md', text }) {
  const px = { sm: 16, md: 32, lg: 48 };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: px[size],
          height: px[size],
          border: '2px solid #fed7aa',
          borderTopColor: '#f97316',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {text && <p style={{ fontSize: 14, color: '#78716c' }}>{text}</p>}
    </div>
  );
}
