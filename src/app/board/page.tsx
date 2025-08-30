"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";

import { Task, Column } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Moon, Sun, LogOut, Search } from "lucide-react";

// Board columns setup
const boardColumns: Column[] = [
  { id: "todo", title: "Todo", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/20" },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900/20" },
];

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [draggedItem, setDraggedItem] = useState<Task | null>(null);

  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let results = tasks;
    
    if (search) {
      results = results.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (priorityFilter !== "all") {
      results = results.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(results);
  }, [tasks, search, priorityFilter]);

  
  
  
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError("Couldn't load tasks");
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: { title: string; description: string; priority: "low" | "medium" | "high" }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create task");
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      setShowModal(false);
      showToast("Task created!", "success");
    } catch (error) {
      showToast("Failed to create task", "error");
    }
  };

  const startDrag = (task: Task) => {
    setDraggedItem(task);
  };

  const endDrag = async (task: Task, newStatus: Task["status"]) => {
    setDraggedItem(null);
    
    if (task.status === newStatus) return;

    const oldStatus = task.status;
    
    // Update UI immediately
    setTasks(prev => prev.map(t =>
      t.id === task.id ? { ...t, status: newStatus } : t
    ));

    try {
              const response = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (!response.ok) throw new Error("Failed to update task");
      
      // Show undo option
      showToast(
        `Moved to ${newStatus.replace("-", " ")}`,
        "info",
        {
          label: "Undo",
          onClick: () => undoMove(task.id, oldStatus)
        },
        5000
      );
    } catch (error) {
      // Revert on failure
      setTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, status: oldStatus } : t
      ));
      showToast("Move failed", "error");
    }
  };

  const undoMove = async (taskId: string, oldStatus: string) => {
    try {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: oldStatus as Task["status"] } : t
      ));

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: oldStatus as Task["status"] }),
      });
      
      if (!response.ok) throw new Error("Failed to undo move");
      showToast("Undone!", "success");
    } catch (error) {
      fetchTasks();
      showToast("Couldn't undo", "error");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showToast("Task deleted", "success");
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boardColumns.map(col => (
              <div key={col.id} className="space-y-4">
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
        <div className="p-6">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</div>
            <button onClick={fetchTasks} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sprint Board Lite
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Task</span>
            </button>
          </div>

          {search || priorityFilter !== "all" ? (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Showing {filteredTasks.length} of {tasks.length} tasks
                {search && ` matching "${search}"`}
                {priorityFilter !== "all" && ` with ${priorityFilter} priority`}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boardColumns.map(col => (
              <div key={col.id} className="space-y-4">
                <div className={`${col.color} p-4 rounded-lg`}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {col.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredTasks.filter(task => task.status === col.id).length} tasks
                  </p>
                </div>
                
                <div className="space-y-3 min-h-[400px]">
                  <AnimatePresence>
                    {filteredTasks
                      .filter(task => task.status === col.id)
                      .map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDragStart={startDrag}
                          onDragEnd={endDrag}
                          onDelete={deleteTask}
                          isDragging={draggedItem?.id === task.id}
                        />
                      ))}
                  </AnimatePresence>
                  
                  {filteredTasks.filter(task => task.status === col.id).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      <p className="text-sm">No tasks here</p>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {search || priorityFilter !== "all" ? "No matches found" : "No tasks yet"}
              </div>
              {!search && priorityFilter === "all" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary"
                >
                  Create your first task
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreateTask={createTask}
        />
      )}
    </div>
  );
}

// Task card component
function TaskCard({ 
  task, 
  onDragStart, 
  onDragEnd, 
  onDelete, 
  isDragging 
}: { 
  task: Task; 
  onDragStart: (task: Task) => void; 
  onDragEnd: (task: Task, newStatus: Task["status"]) => void; 
  onDelete: (taskId: string) => void; 
  isDragging: boolean; 
}) {
  const [hovered, setHovered] = useState(false);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getNextColumn = (currentStatus: string): Task["status"] => {
    switch (currentStatus) {
      case "todo": return "in-progress";
      case "in-progress": return "done";
      default: return "done";
    }
  };

  const getPrevColumn = (currentStatus: string): Task["status"] => {
    switch (currentStatus) {
      case "done": return "in-progress";
      case "in-progress": return "todo";
      default: return "todo";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => onDragStart(task)}
      onDragEnd={(_, info) => {
        const threshold = 100;
        if (info.offset.x > threshold && task.status !== "done") {
          onDragEnd(task, getNextColumn(task.status));
        } else if (info.offset.x < -threshold && task.status !== "todo") {
          onDragEnd(task, getPrevColumn(task.status));
        }
      }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-move transition-all ${
        isDragging ? "shadow-2xl scale-105 rotate-2" : "shadow-sm hover:shadow-md"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              ×
            </motion.button>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          {task.status === "todo" ? "Drag right → to move to In Progress" :
           task.status === "in-progress" ? "Drag left ← to move to Todo, right → to Done" :
           "Drag left ← to move to In Progress"}
        </p>
      </div>
    </motion.div>
  );
}

// Task creation modal
function CreateTaskModal({ 
  onClose, 
  onCreateTask 
}: { 
  onClose: () => void; 
  onCreateTask: (data: { title: string; description: string; priority: "low" | "medium" | "high" }) => void; 
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      setSubmitting(true);
      try {
        await onCreateTask({ title: title.trim(), description: description.trim(), priority });
        onClose();
      } catch (error) {
        // Error handled by parent
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                New Task
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What needs to be done?"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="More details..."
                  maxLength={500}
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !description.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
