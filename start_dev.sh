#!/bin/bash

# ITM Hackathon Development Starter Script

echo "================================================="
echo "  ITM Hackathon: Starting Full-Stack Services    "
echo "================================================="

# Trap Ctrl+C to stop background jobs
trap 'kill $(jobs -p) 2>/dev/null; exit' SIGINT SIGTERM

echo "1. Starting Python Backend on port 8000..."
cd backend && python3 run.py &
BACKEND_PID=$!
cd ..

echo "Backend started (PID: $BACKEND_PID)"
echo "Waiting for backend to initialize..."
sleep 2

echo "2. Starting React Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (npm install)..."
    npm install
fi
npm run dev

# Wait for background jobs
wait
