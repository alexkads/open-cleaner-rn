# Contributing to Open Cleaner RN

Thank you for your interest in contributing to Open Cleaner RN! This document provides guidelines and information for contributors.

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Search existing issues before creating a new one
- Use the bug report template
- Provide detailed reproduction steps
- Include system information (OS, version, etc.)

### ✨ Feature Requests
- Check if the feature already exists or is planned
- Use the feature request template
- Explain the use case and benefits
- Consider implementation complexity

### 💻 Code Contributions
- Fork the repository
- Create a feature branch
- Follow coding standards
- Add tests for new functionality
- Update documentation

### 📚 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Translate documentation
- Update API references

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ and **pnpm** 8+
- **Rust** 1.70+ and **Cargo**
- **Git** for version control

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/open-cleaner-rn.git
   cd open-cleaner-rn
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Run Tests**
   ```bash
   pnpm test
   ```

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow the coding standards below
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   pnpm test:once      # Run all tests
   pnpm build          # Test build process
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Rust
- Follow `rustfmt` formatting
- Use `clippy` for linting
- Write unit tests for new functions
- Use meaningful error types

### Git Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat: add docker cache scanning
fix: resolve memory leak in file scanner
docs: update installation instructions
```

## 🧪 Testing

### Frontend Tests
```bash
pnpm test              # Watch mode
pnpm test:once         # Single run
pnpm test:coverage     # With coverage
```

### Rust Tests
```bash
cargo test             # Run all tests
cargo test --package clean-rn-dev-lib
```

### Integration Tests
```bash
pnpm build:all         # Test full build process
```

## 📖 Documentation

### Code Documentation
- Add JSDoc comments for TypeScript functions
- Use Rust doc comments (`///`) for public APIs
- Include examples in documentation

### User Documentation
- Update relevant pages in `docs-astro/`
- Add screenshots for UI changes
- Update API reference if needed

## 🏗️ Architecture

### Project Structure
```
open-cleaner-rn/
├── src/                    # React frontend
├── src-tauri/             # Rust backend
├── docs-astro/            # Documentation site
├── scripts/               # Build and utility scripts
└── .github/               # CI/CD workflows
```

### Key Components
- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust + Tauri
- **UI**: Modern design with Tailwind CSS
- **Build**: Cross-platform compilation
- **Documentation**: Astro static site

## 🔧 Building

### Development Build
```bash
pnpm build              # Build frontend
pnpm tauri build        # Build desktop app
```

### Production Build
```bash
pnpm release            # Build with optimizations
```

### Platform-Specific Builds
```bash
pnpm build:mac          # macOS universal binary
pnpm build:windows      # Windows x64
pnpm build:linux        # Linux x64
```

## 🐛 Debugging

### Frontend Debugging
- Use browser dev tools
- Enable React DevTools
- Check console for errors

### Rust Debugging
```bash
RUST_LOG=debug pnpm tauri dev
```

### Build Issues
- Check dependencies are installed
- Clear cache: `pnpm clean && pnpm install`
- Verify Rust toolchain: `rustup show`

## 📝 Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass
   - Update documentation
   - Add changelog entry if needed
   - Rebase on latest main branch

2. **PR Description**
   - Use the PR template
   - Explain what changes were made
   - Link related issues
   - Add screenshots for UI changes

3. **Review Process**
   - Maintainers will review within 48 hours
   - Address feedback promptly
   - Keep PR scope focused

4. **Merging**
   - Squash commits when merging
   - Use conventional commit format
   - Update version if needed

## 🏷️ Release Process

Releases are automated through GitHub Actions:

1. **Create Release Tag**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

2. **Automated Process**
   - CI builds for all platforms
   - Creates GitHub release
   - Updates documentation
   - Publishes installers

## 🌍 Community

### Code of Conduct
We follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

### Getting Help
- **Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Discord**: Join our community server (coming soon)

### Recognition
Contributors are recognized in:
- GitHub contributors list
- Release notes
- Documentation credits
- Hall of Fame (coming soon)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to Open Cleaner RN!** 🚀

Your contributions help make development environments cleaner and more efficient for developers worldwide.