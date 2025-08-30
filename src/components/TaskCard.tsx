import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../types';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDelete, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`card mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
            }`}
            onMouseDown={() => console.log('Mouse down on task:', task.id)}
            onDragStart={() => console.log('Drag start on task:', task.id)}
          >
            {/* Task Header */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                {task.title}
              </h4>
              
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
        )}
      </Draggable>

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

export default TaskCard;
