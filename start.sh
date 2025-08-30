#!/bin/bash

echo "🚀 Starting Sprint Board Lite..."

# Start json-server in background
echo "📡 Starting mock API server on port 3001..."
npx json-server --watch db.json --port 3001 --middlewares ./server-middleware.js &
API_PID=$!

# Wait a moment for API to start
sleep 2

# Start Vite dev server
echo "🌐 Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait


