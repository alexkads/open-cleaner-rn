# Open Cleaner RN

<div align="center">

![Open Cleaner RN Logo](https://via.placeholder.com/128x128/0ea5e9/ffffff?text=OCR)

**Professional development environment cleaner for React Native and cross-platform projects**

[![Build Status](https://github.com/alexkads/open-cleaner-rn/workflows/Build%20Documentation%20and%20Release/badge.svg)](https://github.com/alexkads/open-cleaner-rn/actions)
[![Release](https://img.shields.io/github/v/release/alexkads/open-cleaner-rn?color=blue)](https://github.com/alexkads/open-cleaner-rn/releases)
[![Downloads](https://img.shields.io/github/downloads/alexkads/open-cleaner-rn/total?color=green)](https://github.com/alexkads/open-cleaner-rn/releases)
[![License](https://img.shields.io/github/license/alexkads/open-cleaner-rn?color=purple)](https://github.com/alexkads/open-cleaner-rn/blob/main/LICENSE)
[![Platform Support](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)](https://github.com/alexkads/open-cleaner-rn/releases)

[📚 Documentation](https://alexkads.github.io/open-cleaner-rn/) • [⬇️ Download](https://github.com/alexkads/open-cleaner-rn/releases) • [🐛 Report Bug](https://github.com/alexkads/open-cleaner-rn/issues) • [💡 Request Feature](https://github.com/alexkads/open-cleaner-rn/issues)

</div>

## ✨ Features

- **⚡ Lightning Fast**: Built with Rust for maximum performance
- **🛡️ Safe & Reliable**: Only removes cache files and temporary data
- **🎯 Smart Detection**: Automatically finds cache directories across platforms
- **🌍 Cross Platform**: Native performance on macOS, Windows, and Linux
- **📊 Detailed Analytics**: Track cleaning history and space freed
- **🎨 Beautiful UI**: Modern, intuitive interface

## 🧹 What Gets Cleaned

<table>
<tr>
<td>

### 📱 **React Native & Mobile**
- React Native Metro Cache
- Expo Cache & Build Artifacts  
- Hermes Engine Cache
- React Native CLI Cache

</td>
<td>

### 🛠️ **Development IDEs**
- Xcode DerivedData & Caches
- Android Studio System Files
- VS Code Extensions & Logs
- IntelliJ IDEA Caches

</td>
</tr>
<tr>
<td>

### 📦 **Package Managers**
- npm Cache Directories
- Yarn Cache & Temp Files
- pnpm Store & Cache
- CocoaPods Repos & Cache

</td>
<td>

### 🐳 **Build Tools & More**
- Docker Images & Containers
- Gradle Build Cache
- Browser Cache Files
- System Temporary Files

</td>
</tr>
</table>

## 🚀 Quick Start

### Download and Install

1. **Download** the latest release for your platform:
   - [macOS (Universal)](https://github.com/alexkads/open-cleaner-rn/releases/latest)
   - [Windows (x64)](https://github.com/alexkads/open-cleaner-rn/releases/latest)
   - [Linux (x64)](https://github.com/alexkads/open-cleaner-rn/releases/latest)

2. **Install** the application:
   - **macOS**: Open the `.dmg` file and drag to Applications
   - **Windows**: Run the `.msi` installer
   - **Linux**: Install the `.deb` or `.AppImage` file

3. **Launch** Open Cleaner RN and start cleaning!

### Build from Source

```bash
# Clone the repository
git clone https://github.com/alexkads/open-cleaner-rn.git
cd open-cleaner-rn

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build:all
```

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/alexkads/open-cleaner-rn?style=social)
![GitHub forks](https://img.shields.io/github/forks/alexkads/open-cleaner-rn?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/alexkads/open-cleaner-rn?style=social)

</div>

## 🏗️ Built With

- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust + Tauri
- **UI Framework**: Modern CSS with custom design system
- **Build System**: Cross-platform compilation
- **Documentation**: Astro static site generator

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development

### Prerequisites

- Node.js 20+ and pnpm 8+
- Rust 1.70+ and Cargo
- Platform-specific development tools

### Development Commands

```bash
pnpm dev              # Start development server
pnpm test             # Run tests
pnpm build            # Build for production
pnpm release          # Build optimized release
```

### Platform Builds

```bash
pnpm build:mac        # macOS Universal Binary
pnpm build:windows    # Windows x64
pnpm build:linux      # Linux x64
```

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>App won't start on macOS</strong></summary>

If you see "App can't be opened because it is from an unidentified developer":
1. Right-click the app and select "Open"
2. Click "Open" in the dialog
3. Or run: `sudo spctl --master-disable` (temporarily disable Gatekeeper)

</details>

<details>
<summary><strong>Antivirus flags the Windows build</strong></summary>

Some antivirus software may flag the app as suspicious:
1. This is a false positive due to the app's system access requirements
2. Add an exception for the installation directory
3. Download from official GitHub releases only

</details>

<details>
<summary><strong>Permission errors on Linux</strong></summary>

If you encounter permission errors:
1. Make sure the AppImage is executable: `chmod +x Open-Cleaner-RN.AppImage`
2. For system cache cleaning, run with appropriate permissions
3. Check that required dependencies are installed

</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) for cross-platform desktop apps
- Inspired by the need for efficient development environment management
- Thanks to all contributors and the open-source community

## 📈 Roadmap

- [ ] Plugin system for custom cache scanners
- [ ] Cloud backup of cleaning history
- [ ] Team collaboration features
- [ ] Advanced scheduling and automation
- [ ] Integration with popular IDEs
- [ ] Mobile companion app

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=alexkads/open-cleaner-rn&type=Date)](https://star-history.com/#alexkads/open-cleaner-rn&Date)

---

<div align="center">

**Made with ❤️ by [alexkads](https://github.com/alexkads)**

[⭐ Star this repo](https://github.com/alexkads/open-cleaner-rn) • [🐛 Report bugs](https://github.com/alexkads/open-cleaner-rn/issues) • [💬 Join discussions](https://github.com/alexkads/open-cleaner-rn/discussions)

</div>