# 🚀 Clean RN Dev - React Native Environment Cleaner

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.0-orange.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

Um aplicativo desktop moderno e futurístico para limpar ambientes de desenvolvimento React Native e Expo em macOS, Windows e Linux. Construído com Tauri, React Router 7, Tailwind v4 e SQLite.

## ✨ Características

### 🧹 Limpeza Inteligente
- **Quick Clean**: Limpeza rápida de caches comuns
- **Deep Clean**: Varredura profunda e limpeza completa
- **Custom Clean**: Seleção manual de arquivos e pastas
- **Expo Cache**: Limpeza específica de cache do Expo
- **Node Modules**: Detecção e limpeza de node_modules
- **Metro Cache**: Limpeza do cache do Metro bundler
- **Simulator Logs**: Limpeza de logs do simulador iOS

### 🎨 Interface Futurística
- **Design Neon**: Interface com efeitos neon e glassmorphism
- **Animações Fluidas**: Transições suaves com Framer Motion
- **Gráficos Interativos**: Visualização de dados com Recharts
- **Tema Dark**: Interface moderna e amigável aos olhos
- **Responsive**: Adaptável a diferentes tamanhos de tela

### 📊 Monitoramento e Histórico
- **Estatísticas em Tempo Real**: Acompanhe o espaço liberado
- **Histórico Completo**: SQLite para armazenar atividades
- **Gráficos de Análise**: Visualize tendências de limpeza
- **Export de Dados**: Exporte histórico em JSON
- **Filtros Avançados**: Filtre por tipo, data e status

### 🔧 Funcionalidades do Sistema
- **System Tray**: Minimize para a bandeja do sistema
- **Auto-Start**: Inicie automaticamente com o sistema
- **Notificações**: Alertas sobre resultados de limpeza
- **Multi-Platform**: Funciona em macOS, Windows e Linux
- **Custom Title Bar**: Barra de título personalizada

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **React Router 7** - Roteamento SPA moderno
- **Tailwind CSS v4** - Framework CSS utilitário
- **Framer Motion** - Animações e transições
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos

### Backend
- **Tauri 2.0** - Framework para aplicações desktop
- **Rust** - Linguagem de programação do backend
- **SQLite** - Banco de dados local
- **Walkdir** - Navegação em diretórios
- **Regex** - Processamento de texto

### Build & Deploy
- **Vite** - Build tool e dev server
- **PNPM** - Gerenciador de pacotes
- **TypeScript** - Compilação e tipagem

## 📦 Instalação

### Pré-requisitos
- **Node.js** 18+ 
- **Rust** 1.70+
- **PNPM** (recomendado)

### Clone o repositório
```bash
git clone https://github.com/seu-usuario/clean-rn-dev.git
cd clean-rn-dev
```

### Instale as dependências
```bash
pnpm install
```

### Execute em modo desenvolvimento
```bash
pnpm tauri dev
```

### Build para produção
```bash
pnpm tauri build
```

## 🎯 Como Usar

### 1. Dashboard Principal
- Visualize estatísticas em tempo real
- Execute limpeza rápida com um clique
- Monitore tarefas de limpeza ativas
- Acompanhe o espaço liberado

### 2. Configurações
- Configure limpeza automática
- Defina pastas de varredura
- Ajuste notificações
- Configure system tray

### 3. Histórico
- Visualize todo o histórico de limpeza
- Filtre por tipo de limpeza
- Exporte dados para análise
- Remova registros antigos

## 🏗️ Arquitetura

```
clean-rn-dev/
├── src/                    # Frontend React
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços (Tauri, Database)
│   ├── components/        # Componentes reutilizáveis
│   └── styles/           # Estilos globais
├── src-tauri/            # Backend Rust
│   ├── src/              # Código Rust
│   ├── icons/            # Ícones da aplicação
│   └── capabilities/     # Configurações de segurança
├── public/               # Arquivos estáticos
└── dist/                # Build de produção
```

## 🔧 Funcionalidades de Limpeza

### Expo & React Native
- **~/.expo**: Cache do Expo CLI
- **node_modules**: Dependências npm/yarn
- **~/Library/Developer/Xcode/DerivedData**: Cache do Xcode
- **~/.gradle/caches**: Cache do Gradle
- **Metro cache**: Cache do Metro bundler

### Simuladores
- **iOS Simulator logs**: Logs do simulador iOS
- **Android emulator**: Cache do emulador Android
- **Device logs**: Logs de dispositivos conectados

### Builds
- **android/build**: Arquivos de build Android
- **ios/build**: Arquivos de build iOS
- **Pods cache**: Cache do CocoaPods

## 🎨 Customização

### Temas
O projeto usa Tailwind CSS v4 com variáveis CSS customizadas:

```css
@theme {
  --color-primary: #00d2ff;
  --color-secondary: #3a47d5;
  --color-accent: #ff0080;
  --color-success: #00ff88;
  --color-warning: #ffaa00;
  --color-danger: #ff3366;
}
```

### Efeitos Visuais
- **Glass Effect**: `backdrop-filter: blur(20px)`
- **Neon Borders**: `box-shadow: 0 0 10px theme(colors.primary)`
- **Gradient Text**: Gradientes com clip-path
- **Scan Lines**: Animações de varredura

## 🔒 Segurança

### Tauri Security
- **Allowlist restrita**: Apenas comandos necessários
- **CSP configurado**: Content Security Policy
- **File system limitado**: Acesso controlado a arquivos
- **Shell commands**: Comandos validados

### Privacy
- **Dados locais**: Tudo armazenado localmente
- **Sem telemetria**: Nenhum dado enviado externamente
- **Open Source**: Código totalmente auditável

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Tauri](https://tauri.app/) - Framework desktop
- [React](https://reactjs.org/) - Biblioteca UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [Recharts](https://recharts.org/) - Gráficos

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/clean-rn-dev/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/clean-rn-dev/discussions)
- 📧 **Email**: seu-email@exemplo.com

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!** ⭐
