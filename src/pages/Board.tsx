import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { Task, Column } from '../types';
import ColumnComponent from '../components/ColumnComponent';
import CreateTaskModal from '../components/CreateTaskModal';
import SearchAndFilters from '../components/SearchAndFilters';
import Header from '../components/Header';
import { Plus } from 'lucide-react';


const COLUMNS: Column[] = [
  { id: 'todo', title: 'Todo', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/20' },
];

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');


  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks when search or priority filter changes
  useEffect(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, priorityFilter]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      showToast('Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description: string; priority: 'low' | 'medium' | 'high' }) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      setShowCreateModal(false);
      showToast('Task created successfully', 'success');
    } catch (err) {
      showToast('Failed to create task', 'error');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    console.log('Drag end result:', result);
    
    const { destination, source, draggableId } = result;

    if (!destination) {
      console.log('No destination, drag cancelled');
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('Same position, no change needed');
      return;
    }

    const task = tasks.find(t => t.id === draggableId);
    if (!task) {
      console.log('Task not found:', draggableId);
      return;
    }

    const fromStatus = source.droppableId as Task['status'];
    const toStatus = destination.droppableId as Task['status'];

    console.log(`Moving task ${draggableId} from ${fromStatus} to ${toStatus}`);

    // Optimistic update
    const updatedTasks = tasks.map(t =>
      t.id === draggableId ? { ...t, status: toStatus } : t
    );
    setTasks(updatedTasks);



    try {
      await api.updateTask(draggableId, { status: toStatus });
      console.log('Task moved successfully');
      
      // Show undo toast (variant A-G requirement)
      showToast(
        `Task moved to ${toStatus.replace('-', ' ')}`,
        'info',
        {
          label: 'Undo',
          onClick: () => handleUndoMove(draggableId, fromStatus)
        },
        5000
      );
    } catch (err) {
      console.error('Failed to move task:', err);
      // Rollback on failure
      setTasks(prev => prev.map(t =>
        t.id === draggableId ? { ...t, status: fromStatus } : t
      ));
      showToast('Failed to move task', 'error');
    }
  };

  const handleUndoMove = async (taskId: string, fromStatus: string) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: fromStatus as Task['status'] } : t
      ));

      // Update server
      await api.updateTask(taskId, { status: fromStatus as Task['status'] });
      showToast('Move undone successfully', 'success');
    } catch (err) {
      // Rollback on failure
      loadTasks();
      showToast('Failed to undo move', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showToast('Task deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await api.updateTask(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      showToast('Task updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update task', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onLogout={logout} onToggleTheme={toggleTheme} isDark={isDark} />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(column => (
              <div key={column.id} className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onLogout={logout} onToggleTheme={toggleTheme} isDark={isDark} />
        <div className="p-6">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</div>
            <button onClick={loadTasks} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onLogout={logout} onToggleTheme={toggleTheme} isDark={isDark} />
      
      <div className="p-4 md:p-6">
        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Create Task Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Task</span>
          </button>
        </div>



        {/* Board */}
        <DragDropContext 
          onDragEnd={handleDragEnd}
          onDragStart={(result) => console.log('Drag start:', result)}
          onDragUpdate={(result) => console.log('Drag update:', result)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(column => (
              <ColumnComponent
                key={column.id}
                column={column}
                tasks={filteredTasks.filter(task => task.status === column.id)}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Empty State */}
        {filteredTasks.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              {searchTerm || priorityFilter !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
            </div>
            {!searchTerm && priorityFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create your first task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Board;
