import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { Edit2, Trash2, MoreVertical, Wifi, WifiOff } from 'lucide-react';
import EditTaskModal from './EditTaskModal';
import { offlineQueue } from '../services/offlineQueue';

interface ModernTaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onMoveLeft?: (taskId: string) => void;
  onMoveRight?: (taskId: string) => void;
}

const ModernTaskCard: React.FC<ModernTaskCardProps> = ({ 
  task, 
  onDelete, 
  onUpdate, 
  onMoveLeft, 
  onMoveRight 
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOnline, setIsOnline] = useState(offlineQueue.isOnlineStatus());
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if this task is queued
  const isQueued = task.id.startsWith('temp-');
  const queuedActionId = isQueued ? task.id.replace('temp-', '') : null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Keyboard navigation for moving tasks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused) return;
      
      if (event.key === '[') {
        event.preventDefault();
        if (onMoveLeft) {
          onMoveLeft(task.id);
        }
      } else if (event.key === ']') {
        event.preventDefault();
        if (onMoveRight) {
          onMoveRight(task.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, task.id, onMoveLeft, onMoveRight]);

  // Listen for online/offline status changes
  useEffect(() => {
    const unsubscribe = offlineQueue.addListener((online) => {
      setIsOnline(online);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node);
          cardRef.current = node;
        }}
        style={style}
        {...attributes}
        {...listeners}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`card mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isDragging ? 'shadow-lg rotate-2 opacity-50' : ''
        } ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      >
        {/* Task Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
              {task.title}
            </h4>
            
            {/* Offline Queue Badge */}
            {isQueued && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-medium">
                <WifiOff size={12} />
                <span>Queued</span>
              </div>
            )}
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label="Task options"
            >
              <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Task Footer */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {getPriorityLabel(task.priority)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        onUpdate={onUpdate}
      />

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default ModernTaskCard;
