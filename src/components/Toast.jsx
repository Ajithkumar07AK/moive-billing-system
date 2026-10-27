import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl glass-panel shadow-2xl border"
        style={{
          borderColor: isError ? '#ef4444' : isSuccess ? '#10b981' : '#4f6bff',
        }}
      >
        {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
        {!isError && !isSuccess && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}

        <p className="text-sm font-medium text-slate-100">{message}</p>

        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
