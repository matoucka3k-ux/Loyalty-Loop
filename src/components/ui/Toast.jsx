import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500
    );
  };

  return {
    toasts,
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
  };
}

export function ToastContainer({ toasts }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 12,
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
            fontSize: 14,
            fontWeight: 500,
            background: 'white',
            border:
              toast.type === 'success'
                ? '1px solid #bbf7d0'
                : '1px solid #fecaca',
            color: toast.type === 'success' ? '#15803d' : '#dc2626',
          }}
        >
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
