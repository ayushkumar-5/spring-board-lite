import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, Wifi, WifiOff } from 'lucide-react';
import { offlineQueue } from '../services/offlineQueue';

interface HeaderProps {
  onLogout: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onToggleTheme, isDark }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(offlineQueue.isOnlineStatus());
  const [queuedCount, setQueuedCount] = useState(offlineQueue.getQueue().length);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Listen for online/offline status changes
  useEffect(() => {
    const unsubscribe = offlineQueue.addListener((online) => {
      setIsOnline(online);
      setQueuedCount(offlineQueue.getQueue().length);
    });
    return unsubscribe;
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Sprint Board
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lite</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Online/Offline Status */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            {isOnline ? (
              <Wifi size={16} className="text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff size={16} className="text-red-600 dark:text-red-400" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {queuedCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                {queuedCount} queued
              </span>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
