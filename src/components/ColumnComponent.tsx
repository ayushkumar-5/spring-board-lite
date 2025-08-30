import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Task, Column } from '../types';
import TaskCard from './TaskCard';

interface ColumnComponentProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({
  column,
  tasks,
  onDeleteTask,
  onUpdateTask,
}) => {
  return (
    <div className={`${column.color} rounded-lg p-4 min-h-[400px]`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          {column.title}
        </h3>
        <span className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[300px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-white/50 dark:bg-gray-700/50' : ''
            }`}
            onMouseEnter={() => console.log('Mouse enter droppable:', column.id)}
          >
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No tasks</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ColumnComponent;
