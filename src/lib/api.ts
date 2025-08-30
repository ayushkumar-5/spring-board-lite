import { Task, CreateTaskData, UpdateTaskData } from "@/types";

const API_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001";

// Randomly fail some requests to test error handling
const shouldFail = (method: string): boolean => {
  if ((method === "PATCH" || method === "POST") && Math.random() < 0.1) {
    console.log(`💥 Simulating failure for ${method}`);
    return true;
  }
  return false;
};

export const api = {
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return res.json();
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    if (shouldFail("POST")) {
      throw new Error("Simulated failure for testing");
    }

    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error("Failed to create task");
    }
    
    return res.json();
  },

  async updateTask(id: string, changes: UpdateTaskData): Promise<Task> {
    if (shouldFail("PATCH")) {
      throw new Error("Simulated failure for testing");
    }

    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...changes,
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!res.ok) {
      throw new Error("Failed to update task");
    }
    
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      throw new Error("Failed to delete task");
    }
  },
};
