import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TestTask: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 mb-2 rounded border cursor-grab ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      {title}
    </div>
  );
};

const TestColumn: React.FC<{ id: string; title: string; tasks: { id: string; title: string }[] }> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="bg-gray-100 p-4 rounded min-h-[200px]">
      <h3 className="font-bold mb-4">{title}</h3>
      <div ref={setNodeRef} className="min-h-[150px]">
        {tasks.map((task) => (
          <TestTask key={task.id} id={task.id} title={task.title} />
        ))}
      </div>
    </div>
  );
};

const DragTestPage: React.FC = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' },
    ],
    'in-progress': [
      { id: '3', title: 'Task 3' },
    ],
    done: [
      { id: '4', title: 'Task 4' },
    ],
  });

  const [activeTask, setActiveTask] = useState<{ id: string; title: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = Object.values(tasks).flat().find(t => t.id === active.id);
    setActiveTask(task || null);
    console.log('Drag start:', active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    console.log(`Moving task ${activeId} to ${overId}`);
    
    // Find which column the task is currently in
    let fromColumn = '';
    for (const [column, columnTasks] of Object.entries(tasks)) {
      if (columnTasks.find(t => t.id === activeId)) {
        fromColumn = column;
        break;
      }
    }

    if (fromColumn && fromColumn !== overId) {
      const task = tasks[fromColumn].find(t => t.id === activeId);
      if (task) {
        setTasks(prev => ({
          ...prev,
          [fromColumn]: prev[fromColumn].filter(t => t.id !== activeId),
          [overId]: [...prev[overId], task],
        }));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    console.log('Drag end:', event);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Drag and Drop Test</h1>
      <p className="mb-4 text-gray-600">Try dragging tasks between columns to test the functionality.</p>
      
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestColumn id="todo" title="Todo" tasks={tasks.todo} />
          <TestColumn id="in-progress" title="In Progress" tasks={tasks['in-progress']} />
          <TestColumn id="done" title="Done" tasks={tasks.done} />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-3 rounded border shadow-lg opacity-80">
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DragTestPage;
