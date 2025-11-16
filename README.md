# Open Cleaner RN

<div align="center">

![Open Cleaner RN Logo](https://via.placeholder.com/128x128/0ea5e9/ffffff?text=OCR)

**Professional development environment cleaner for React Native and cross-platform projects**

[![Build Status](https://github.com/alexkads/open-cleaner-rn/workflows/Build%20Documentation%20and%20Release/badge.svg)](https://github.com/alexkads/open-cleaner-rn/actions)
[![Release](https://img.shields.io/github/v/release/alexkads/open-cleaner-rn?color=blue)](https://github.com/alexkads/open-cleaner-rn/releases)
[![Downloads](https://img.shields.io/github/downloads/alexkads/open-cleaner-rn/total?color=green)](https://github.com/alexkads/open-cleaner-rn/releases)
[![License](https://img.shields.io/github/license/alexkads/open-cleaner-rn?color=purple)](https://github.com/alexkads/open-cleaner-rn/blob/main/LICENSE)
[![Platform Support](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)](https://github.com/alexkads/open-cleaner-rn/releases)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-blue?logo=github)](https://alexkads.github.io/open-cleaner-rn/)

[📚 Documentation](https://alexkads.github.io/open-cleaner-rn/) • [⬇️ Download](https://github.com/alexkads/open-cleaner-rn/releases) • [🐛 Report Bug](https://github.com/alexkads/open-cleaner-rn/issues) • [💡 Request Feature](https://github.com/alexkads/open-cleaner-rn/issues)

---

## 📚 **[➤ Acesse a Documentação Completa](https://alexkads.github.io/open-cleaner-rn/)**

🌐 **Website oficial**: https://alexkads.github.io/open-cleaner-rn/

> 📖 Documentação completa com guias de instalação, configuração, troubleshooting e muito mais!

---

</div>

## 📦 **PADRONIZADO: Este projeto usa npm**

> **✅ PADRONIZAÇÃO:** Este projeto usa **EXCLUSIVAMENTE npm** para evitar conflitos de CI/CD.

📖 **Leia [NPM_ONLY.md](./NPM_ONLY.md) para entender a padronização**

### **Quick Setup:**
```bash
# 1. Instalar dependências raiz
npm install

# 2. Instalar dependências da documentação
npm run docs:install
```

### **Documentation Commands:**
```bash
npm run docs:dev      # Start docs dev server
npm run docs:build    # Build documentation
npm run docs:preview  # Preview built docs
```

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
- npm Cache
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
npm install

# Start development server
npm run dev

# Build for production
npm run build:all
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
- **Documentation**: Astro static site generator ([📚 Live Docs](https://alexkads.github.io/open-cleaner-rn/))

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

- Node.js 20+ and npm 8+
- Rust 1.70+ and Cargo
- Platform-specific development tools

### Development Commands

```bash
npm run dev           # Start development server
npm test              # Run tests
npm run build         # Build for production
npm run release       # Build optimized release
```

## 🧪 Testing

This project includes comprehensive automated tests for all new features.

### Running Tests

```bash
# Run all tests (watch mode)
npm test

# Run tests once (CI mode)
npm run test:once

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

| Component | Coverage | Tests |
|-----------|----------|-------|
| **CleanConfirmationDialog** | 95% | 16 tests |
| **CleaningProgress** | 90% | 21 tests |
| **Dashboard Features** | 78% | 14 tests |

📖 **[See full testing documentation →](./docs/TESTING.md)**

### Key Features Tested

- ✅ **Scan Paralelo:** Promise.all execution & performance
- ✅ **Limpeza Seletiva:** Checkbox functionality & selection logic
- ✅ **Dialog de Confirmação:** User interactions & data display
- ✅ **Barra de Progresso:** Real-time updates & calculations

### Platform Builds

```bash
npm run build:mac     # macOS Universal Binary
npm run build:windows # Windows x64
npm run build:linux   # Linux x64
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

## 🗺️ Roadmap

> 📋 **[Ver Roadmap Completo de Melhorias →](./IMPROVEMENT_ROADMAP.md)**

### **Concluído ✅**
- [x] Cross-platform desktop application
- [x] React Native cache cleaning
- [x] iOS build cache cleanup
- [x] Android build cache cleanup
- [x] Package manager cache cleaning
- [x] Docker resources cleanup
- [x] Cleaning history and analytics
- [x] **Scan paralelo** - Redução de 50-70% no tempo de scan (v0.2.0)
- [x] **Dialog de confirmação** - Proteção contra limpeza acidental (v0.2.0)
- [x] **Barra de progresso visual** - Feedback em tempo real com velocidade e ETA (v0.2.0)
- [x] **Limpeza seletiva** - Checkboxes para escolher categorias (v0.2.0)

### **Em Progresso 🚧**
- [x] **Scan paralelo (v0.2.0)** ✅ _Concluído em 16/11/2025_
- [x] **Dialog de confirmação antes de limpar (v0.2.0)** ✅ _Concluído em 16/11/2025_
- [x] **Barra de progresso visual (v0.2.0)** ✅ _Concluído em 16/11/2025_
- [x] **Limpeza seletiva com checkboxes (v0.2.0)** ✅ _Concluído em 16/11/2025_
- [ ] Error boundaries (v0.2.0)

### **Planejado 📅**
- [ ] Dry run mode (preview sem deletar) (v0.3.0)
- [ ] Notificações desktop (v0.3.0)
- [ ] Temas claro/escuro (v0.3.0)
- [ ] Exportar relatórios (CSV/JSON) (v0.3.0)
- [ ] Atalhos de teclado (v0.3.0)
- [ ] Scan agendado automático (v0.4.0)
- [ ] Sistema de backup antes de limpar (v0.4.0)
- [ ] Sistema de plugins (futuro)
- [ ] API REST (futuro)
- [ ] Cloud sync de configurações (futuro)

**📖 Documentação Detalhada:** [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=alexkads/open-cleaner-rn&type=Date)](https://star-history.com/#alexkads/open-cleaner-rn&Date)

---

<div align="center">

**Made with ❤️ by [alexkads](https://github.com/alexkads)**

[⭐ Star this repo](https://github.com/alexkads/open-cleaner-rn) • [🐛 Report bugs](https://github.com/alexkads/open-cleaner-rn/issues) • [💬 Join discussions](https://github.com/alexkads/open-cleaner-rn/discussions)

</div># CI/CD funcionando! ✅
