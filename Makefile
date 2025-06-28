# Clean RN Dev - Build Makefile
# Simplified commands for building installers

.PHONY: help install test build build-all clean dev release

# Default target
help:
	@echo "Clean RN Dev - Available Commands:"
	@echo "=================================="
	@echo "  dev              Start development server"
	@echo "  install          Install all dependencies"
	@echo "  test             Run tests"
	@echo "  build            Build for current platform"
	@echo "  build-all        Build for all platforms (cross-compilation)"
	@echo "  build-mac        Build for macOS"
	@echo "  build-windows    Build for Windows"
	@echo "  build-linux      Build for Linux"
	@echo "  build-linux-arm  Build for Linux ARM64"
	@echo "  release          Build production release"
	@echo "  clean            Clean build artifacts"
	@echo "  setup-targets    Install Rust cross-compilation targets"
	@echo ""
	@echo "Examples:"
	@echo "  make dev         # Start development"
	@echo "  make build-all   # Build all platforms"
	@echo "  make release     # Production build"

# Development
dev:
	pnpm tauri dev

# Install dependencies
install:
	pnpm install
	@echo "✅ Dependencies installed"

# Run tests
test:
	pnpm test:once
	@echo "✅ Tests completed"

# Build frontend only
build-frontend:
	pnpm build
	@echo "✅ Frontend built"

# Build for current platform
build: test build-frontend
	pnpm build:all
	@echo "✅ Build completed for current platform"

# Cross-platform builds
build-mac: test build-frontend
	pnpm build:mac
	@echo "✅ macOS build completed"

build-windows: test build-frontend
	pnpm build:windows
	@echo "✅ Windows build completed"

build-linux: test build-frontend
	pnpm build:linux
	@echo "✅ Linux build completed"

build-linux-arm: test build-frontend
	pnpm build:linux-arm
	@echo "✅ Linux ARM64 build completed"

# Build all platforms using script
build-all:
	@chmod +x scripts/build-all.sh
	./scripts/build-all.sh

# Production release
release: test build-frontend
	pnpm release
	@echo "✅ Release build completed"

# Setup cross-compilation targets
setup-targets:
	@echo "Installing Rust cross-compilation targets..."
	rustup target add x86_64-pc-windows-msvc
	rustup target add x86_64-unknown-linux-gnu
	rustup target add aarch64-unknown-linux-gnu
	rustup target add universal-apple-darwin
	@echo "✅ Cross-compilation targets installed"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf src-tauri/target/
	rm -rf node_modules/.vite/
	pnpm store prune
	@echo "✅ Clean completed"

# Quick development setup
setup: install setup-targets
	@echo "✅ Development environment setup completed"
	@echo ""
	@echo "Next steps:"
	@echo "  make dev         # Start development server"
	@echo "  make build-all   # Build installers for all platforms"