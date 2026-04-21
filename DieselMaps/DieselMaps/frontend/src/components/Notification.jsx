import { useEffect } from 'react';

export default function Notification({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="flex items-center gap-2">
        <span>
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
        </span>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}