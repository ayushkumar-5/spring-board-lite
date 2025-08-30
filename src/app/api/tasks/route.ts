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

export async function GET() {
  try {
    simulateFailure();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    simulateFailure();
    const body = await request.json();
    
    const newTask = {
      id: Date.now().toString(),
      ...body,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
