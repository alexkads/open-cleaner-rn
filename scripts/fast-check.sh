#!/bin/bash

# Fast Rust check script for development
set -e

echo "🦀 Running fast Rust checks..."

cd src-tauri

# Quick syntax and type check
echo "📝 Checking syntax and types..."
cargo check --lib

# Format check
echo "🎨 Checking formatting..."
cargo fmt --all -- --check

# Quick clippy on lib only
echo "📎 Running clippy on lib..."
cargo clippy --lib -- -D warnings

echo "✅ Fast checks completed!"