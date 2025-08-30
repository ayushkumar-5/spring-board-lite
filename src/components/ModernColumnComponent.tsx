import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Column } from '../types';
import ModernTaskCard from './ModernTaskCard';

interface ModernColumnComponentProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMoveLeft?: (taskId: string) => void;
  onMoveRight?: (taskId: string) => void;
}

const ModernColumnComponent: React.FC<ModernColumnComponentProps> = ({
  column,
  tasks,
  onDeleteTask,
  onUpdateTask,
  onMoveLeft,
  onMoveRight,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className={`${column.color} rounded-lg p-4 min-h-[400px] max-h-[800px]`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          {column.title}
        </h3>
        <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-2 py-1 rounded-full">
          {tasks.length} tasks
        </span>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className="min-h-[300px] transition-colors duration-200 overflow-y-auto max-h-[600px]"
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            <>
              {console.log(`Rendering ${tasks.length} tasks for column ${column.id}:`, tasks.map(t => t.title))}
              {tasks.map((task) => (
                <ModernTaskCard
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                  onMoveLeft={onMoveLeft}
                  onMoveRight={onMoveRight}
                />
              ))}
            </>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default ModernColumnComponent;
