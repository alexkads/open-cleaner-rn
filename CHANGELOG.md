# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Tauri + React + TypeScript
- Cross-platform desktop application structure
- Documentation site with Astro
- CI/CD pipeline with GitHub Actions

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [0.1.0] - 2025-06-28

### Added
- 🎉 Initial release of Open Cleaner RN
- ⚡ Lightning-fast Rust backend with Tauri
- 🎨 Modern React frontend with TypeScript
- 🌍 Cross-platform support (macOS, Windows, Linux)
- 🧹 Smart cache detection and cleaning for:
  - React Native Metro Cache
  - npm/yarn cache
  - Xcode DerivedData
  - Android Studio caches
  - VS Code extensions
  - Docker containers and images
  - Browser caches
- 📊 Detailed analytics and cleaning history
- 🛡️ Safe file operations with user confirmation
- 📚 Comprehensive documentation site
- 🔄 Automated CI/CD pipeline
- 🧪 Unit and integration tests
- 📦 Distribution packages for all platforms

### Changed
- N/A (initial release)

### Security
- 🔒 Implemented safe file operations
- 🛡️ Added user confirmation for destructive operations
- 🔐 Sandboxed execution with minimal permissions

---

## Release Types

- **Major** (x.0.0): Breaking changes, major new features
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes, minor improvements

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

## How to Update This File

1. Add unreleased changes to the `[Unreleased]` section
2. When releasing, move items to a new version section
3. Update version links at the bottom
4. Follow the categorization: Added, Changed, Deprecated, Removed, Fixed, Security

[Unreleased]: https://github.com/alexkads/open-cleaner-rn/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/alexkads/open-cleaner-rn/releases/tag/v0.1.0
