import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface NotificationBannerProps {
  message: string | null;
  type: 'error' | 'success';
  onDismiss: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  type,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div className={`toast-banner toast-${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        style={{ background: 'transparent', border: 'none', color: 'currentColor', cursor: 'pointer' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
