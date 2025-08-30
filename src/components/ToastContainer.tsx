import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} border rounded-lg p-4 shadow-lg transition-all duration-300 transform translate-x-0 hover:translate-x-1`}
        >
          <div className="flex items-start space-x-3">
            {getToastIcon(toast.type)}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.message}</p>
              
              {/* Action Button (for undo functionality) */}
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
