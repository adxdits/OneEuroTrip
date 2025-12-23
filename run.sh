#!/bin/bash

echo "Starting Monument Recognition - Local AI"
echo "========================================"
echo ""

# Start backend
echo "[1/2] Starting backend..."
cd backend
./mvnw quarkus:dev &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 15

# Start Rust TUI frontend
echo ""
echo "[2/2] Starting Rust TUI frontend..."
cd ../frontend
cargo run --release

# Cleanup
kill $BACKEND_PID 2>/dev/null
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
