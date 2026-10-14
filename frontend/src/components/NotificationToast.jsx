import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <div style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              opacity: 0.8,
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
