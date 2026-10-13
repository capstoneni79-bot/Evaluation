import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  // Never show more than 3 toasts at once to prevent screen clutter
  const visibleToasts = toasts.slice(-3);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none">
      {visibleToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyle =
    toast.type === 'success'
      ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-lg'
      : toast.type === 'error'
      ? 'bg-rose-950/95 text-white border-rose-500/40 shadow-lg'
      : 'bg-slate-900/95 text-white border-slate-700 shadow-lg';

  const icon =
    toast.type === 'success' ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    ) : toast.type === 'error' ? (
      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
    ) : (
      <Info className="w-4 h-4 text-blue-400 shrink-0" />
    );

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start justify-between gap-3 p-3 rounded-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bgStyle}`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="mt-0.5">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-tight text-white truncate">{toast.title}</p>
          {toast.description && (
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">{toast.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors p-0.5 rounded cursor-pointer shrink-0 ml-1"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
