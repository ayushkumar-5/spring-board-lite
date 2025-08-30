"use client";

import { useToast } from "@/contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getBgColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    case "error":
      return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    case "info":
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    default:
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
  }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`max-w-sm w-full p-4 rounded-lg border shadow-lg ${getBgColor(toast.type)}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(toast.type)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {toast.message}
                </p>
                
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}





