import { useEffect } from 'react';

export default function Toast({ show = false, message = '', type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;
  const base = 'fixed bottom-4 right-4 z-50 rounded-md px-4 py-2 shadow-lg text-sm font-medium';
  const styles = type === 'error'
    ? 'bg-red-600 text-white'
    : type === 'warning'
    ? 'bg-yellow-500 text-white'
    : 'bg-green-600 text-white';
  return (
    <div className={`${base} ${styles}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
