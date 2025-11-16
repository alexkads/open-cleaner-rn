#!/bin/bash
# Script to kill all dev servers running on common ports

echo "Stopping development servers..."

# Kill processes on port 1420 (Vite)
lsof -ti:1420 | xargs kill -9 2>/dev/null && echo "✓ Killed Vite server on port 1420" || echo "✗ No Vite server found on port 1420"

# Kill any remaining Tauri processes
pkill -f "clean-rn-dev" 2>/dev/null && echo "✓ Killed Tauri processes" || echo "✗ No Tauri processes found"

# Kill any remaining Vite processes
pkill -f "vite" 2>/dev/null && echo "✓ Killed Vite processes" || echo "✗ No Vite processes found"

echo "Done!"
