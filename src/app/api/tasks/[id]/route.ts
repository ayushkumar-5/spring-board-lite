import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, you'd use a real database
let tasks = [
  {
    id: "1",
    title: "Wire nav",
    description: "Sketch top nav",
    status: "todo",
    priority: "medium",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z"
  },
  {
    id: "2",
    title: "Design system",
    description: "Create component library and design tokens",
    status: "in-progress",
    priority: "high",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z"
  },
  {
    id: "3",
    title: "User research",
    description: "Conduct user interviews and surveys",
    status: "done",
    priority: "low",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z"
  }
];

// Simulate 10% failure rate
const simulateFailure = () => {
  if (Math.random() < 0.1) {
    throw new Error('Simulated API failure');
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    simulateFailure();
    const task = tasks.find(t => t.id === params.id);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    simulateFailure();
    const body = await request.json();
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    simulateFailure();
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
    );
    }
    
    tasks.splice(taskIndex, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
