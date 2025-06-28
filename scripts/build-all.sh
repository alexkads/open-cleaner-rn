#!/bin/bash

# Clean RN Dev - Cross-platform Build Script
# This script builds installers for macOS, Windows, and Linux

set -e

echo "🚀 Starting cross-platform build for Clean RN Dev..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v cargo &> /dev/null; then
        print_error "Rust is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v tauri &> /dev/null; then
        print_error "Tauri CLI is not installed. Please install it with: cargo install tauri-cli"
        exit 1
    fi
    
    print_status "All dependencies are available ✅"
}

# Install frontend dependencies
install_dependencies() {
    print_status "Installing frontend dependencies..."
    npm install
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test:once
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    npm run build
}

# Build for current platform
build_current_platform() {
    print_status "Building for current platform..."
    tauri build
    print_status "✅ Build completed for current platform"
}

# Build for specific platform (if cross-compilation is available)
build_specific_platform() {
    local target=$1
    local platform_name=$2
    
    print_status "Building for $platform_name ($target)..."
    
    if tauri build --target "$target" 2>/dev/null; then
        print_status "✅ Build completed for $platform_name"
    else
        print_warning "⚠️  Cross-compilation for $platform_name is not available on this system"
        print_warning "To build for $platform_name, run this script on a $platform_name system"
    fi
}

# Main build function
main() {
    echo "🏗️  Clean RN Dev - Cross-platform Builder"
    echo "========================================"
    
    check_dependencies
    install_dependencies
    run_tests
    build_frontend
    
    print_status "Starting Tauri builds..."
    
    # Always build for current platform
    build_current_platform
    
    # Attempt cross-compilation (may not work depending on the host system)
    print_status "Attempting cross-platform builds..."
    
    case "$(uname -s)" in
        Darwin*)
            print_status "Running on macOS - building universal binary"
            build_specific_platform "universal-apple-darwin" "macOS Universal"
            build_specific_platform "x86_64-pc-windows-msvc" "Windows"
            build_specific_platform "x86_64-unknown-linux-gnu" "Linux"
            ;;
        Linux*)
            print_status "Running on Linux"
            build_specific_platform "x86_64-unknown-linux-gnu" "Linux"
            build_specific_platform "aarch64-unknown-linux-gnu" "Linux ARM64"
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*)
            print_status "Running on Windows"
            build_specific_platform "x86_64-pc-windows-msvc" "Windows"
            ;;
        *)
            print_warning "Unknown operating system: $(uname -s)"
            ;;
    esac
    
    echo ""
    print_status "🎉 Build process completed!"
    print_status "📦 Installers can be found in: src-tauri/target/[target]/release/bundle/"
    echo ""
    echo "📋 Available installer formats by platform:"
    echo "   • macOS: .dmg, .app"
    echo "   • Windows: .msi, .exe (NSIS)"
    echo "   • Linux: .deb, .rpm, .AppImage"
    echo ""
    print_status "For GitHub releases, use the automated workflow or run:"
    print_status "npm run release"
}

# Run the main function
main "$@"