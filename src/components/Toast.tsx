import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastItem { id: number; type: ToastType; message: string; }
interface ToastCtx { toast: (msg: string, type?: ToastType) => void; }

const Ctx = createContext<ToastCtx | null>(null);
let _id = 0;

const icons: Record<ToastType, string> = { success: '✓', error: '✕', warning: '⚠' };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_id;
    setItems(prev => [...prev, { id, type, message }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {items.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{icons[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
