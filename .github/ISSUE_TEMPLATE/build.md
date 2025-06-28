---
name: Build Issue
about: Report an issue with building Open Cleaner RN from source
title: ''
labels: 'build'
assignees: ''

---

## 🔨 Build Issue

**Describe the build problem**
A clear and concise description of what went wrong during the build process.

**Build command**
What command are you running?
- [ ] `npm run build`
- [ ] `npm run build:all`
- [ ] `npm run build:mac`
- [ ] `npm run build:windows`
- [ ] `npm run build:linux`
- [ ] `npm run release`
- [ ] `cargo build`
- [ ] `tauri build`
- [ ] Other: _____

**Platform**
- [ ] macOS
- [ ] Windows
- [ ] Linux (which distribution?)

**Error message**
Please paste the exact error message you're seeing.

**Steps to reproduce**
1. Clone the repository
2. Run `npm install`
3. Run build command '....'
4. See error

**Expected behavior**
A clear and concise description of what should happen during the build.

**Environment**
- OS: [e.g. macOS 14.0, Windows 11, Ubuntu 22.04]
- Node.js: [e.g. 20.0.0]
- npm: [e.g. 10.0.0]
- Rust: [e.g. 1.70.0]
- Cargo: [e.g. 1.70.0]
- Tauri CLI: [e.g. 2.0.0]

**Prerequisites check**
- [ ] Node.js 20+ installed
- [ ] npm 8+ installed
- [ ] Rust 1.70+ installed
- [ ] Cargo installed
- [ ] Platform-specific build tools installed
- [ ] Dependencies installed (`npm install`)

**Build logs**
Please include the relevant build logs, especially the error output.

**Additional context**
Add any other context about the build issue here.

**Checklist**
- [ ] I've tried cleaning the build cache
- [ ] I've tried deleting `node_modules` and reinstalling
- [ ] I've tried deleting `target` directory (for Rust builds)
- [ ] I've checked that all prerequisites are installed 