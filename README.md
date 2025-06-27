# 🚀 Clean RN Dev - React Native Environment Cleaner

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.0-orange.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

Uma aplicação Tauri para limpeza completa de ambientes de desenvolvimento React Native/Expo em macOS, Windows e Linux. Interface futurística com integração à bandeja do sistema e rastreamento de histórico SQLite.

## 🚀 Funcionalidades

### 🧹 Limpeza Abrangente do Ambiente
- **Expo Cache** - Cache de builds e assets do Expo (`~/.expo`)
- **Metro Bundler Cache** - Cache do Metro bundler (`~/.metro`, `/tmp/metro-cache`)
- **iOS Development Cache** - Xcode DerivedData, Simulador e logs iOS
- **Android Development Cache** - Gradle cache, emulador e builds Android
- **NPM/Yarn Cache** - Cache de pacotes npm e yarn
- **Watchman Cache** - Cache e logs do Watchman (file watcher)
- **CocoaPods Cache** - Cache de pods e repositórios CocoaPods
- **Flipper Logs** - Logs e cache do Flipper debugger
- **Temporary Files** - Arquivos temporários de desenvolvimento
- **Docker Containers** - Containers Docker parados e não utilizados
- **Docker Images** - Imagens Docker órfãs e não utilizadas
- **Docker Volumes** - Volumes Docker órfãos sem containers ativos
- **Docker Build Cache** - Cache de builds Docker e camadas intermediárias
- **Node Modules** - Diretórios node_modules de projetos

### 🎨 Interface Futurística
- Design neon com cores ciano (#00d2ff) e magenta (#ff0080)
- Efeitos de vidro e glassmorphism
- Animações suaves com Framer Motion
- Indicadores de progresso em tempo real
- Feedback visual detalhado para cada operação

### 📊 Recursos Avançados
- **Scan Inteligente** - Detecta automaticamente todos os tipos de cache
- **Progresso em Tempo Real** - Indicadores visuais para cada tarefa
- **Bandeja do Sistema** - Minimiza para a bandeja em vez de fechar
- **Histórico de Limpeza** - Rastreamento SQLite de todas as operações
- **Estatísticas Detalhadas** - Arquivos deletados, espaço liberado, duração
- **Tratamento de Erros** - Log completo de erros com detalhes

## 🛠️ Tecnologias

### Frontend
- **React 18** + TypeScript
- **React Router 7** (SPA)
- **Tailwind CSS v4** (configuração CSS-first)
- **Framer Motion** (animações)
- **Lucide React** (ícones)
- **Recharts** (gráficos)

### Backend (Rust/Tauri)
- **Tauri 2.6** (framework principal)
- **SQLite** (histórico de limpeza)
- **Walkdir** (navegação de diretórios)
- **Dirs** (diretórios do sistema)
- **Which** (detecção de ferramentas)

## 📁 Locais de Limpeza

### macOS
- `~/.expo` - Cache do Expo
- `~/.metro` - Cache do Metro
- `~/Library/Developer/Xcode/DerivedData` - Dados derivados do Xcode
- `~/Library/Caches/com.apple.dt.Xcode` - Cache do Xcode
- `~/Library/Developer/CoreSimulator/Caches` - Cache do Simulador iOS
- `~/Library/Logs/CoreSimulator` - Logs do Simulador
- `~/.gradle/caches` - Cache do Gradle
- `~/.npm/_cacache` - Cache do NPM
- `~/.yarn/cache` - Cache do Yarn
- `~/.watchman` - Cache do Watchman
- `~/Library/Caches/CocoaPods` - Cache do CocoaPods
- `~/.flipper` - Logs do Flipper
- `/tmp/react-native-*` - Arquivos temporários

#### Docker (Multiplataforma)
- `docker container ls -a --filter status=exited` - Containers parados
- `docker images -f dangling=true` - Imagens órfãs
- `docker volume ls -f dangling=true` - Volumes não utilizados
- `docker system df` - Cache de builds e dados do sistema

### Windows
- `%APPDATA%\Local\Expo` - Cache do Expo
- `%APPDATA%\Local\Metro` - Cache do Metro
- `%APPDATA%\Local\Android\Sdk\.temp` - Temp do Android SDK
- `%APPDATA%\Local\Temp\AndroidEmulator` - Temp do Emulador
- `%APPDATA%\Roaming\npm-cache` - Cache do NPM
- `%APPDATA%\Local\Yarn\Cache` - Cache do Yarn
- `%APPDATA%\Roaming\flipper` - Logs do Flipper

### Linux
- `~/.expo` - Cache do Expo
- `~/.metro` - Cache do Metro
- `~/.gradle/caches` - Cache do Gradle
- `~/.npm/_cacache` - Cache do NPM
- `~/.yarn/cache` - Cache do Yarn
- `~/.watchman` - Cache do Watchman
- `/tmp/react-native-*` - Arquivos temporários

## 🚀 Como Usar

1. **Executar Scan**
   - Clique em "Quick Scan" para detectar todos os caches
   - Aguarde o processo de varredura completa
   - Veja o espaço total encontrado

2. **Limpar Arquivos**
   - Clique em "Clean Selected" para limpar os itens encontrados
   - Acompanhe o progresso em tempo real
   - Veja o resumo detalhado dos resultados

3. **Bandeja do Sistema**
   - Fechar a janela minimiza para a bandeja
   - Clique no ícone da bandeja para restaurar
   - Menu de contexto com opções "Mostrar Janela" e "Sair"

## 🔧 Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Rust 1.70+
- Tauri CLI

### Instalação
```bash
# Clonar repositório
git clone <repo-url>
cd open-cleaner-rn

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run tauri dev
```

### Build
```bash
# Build para produção
npm run tauri build
```

## 📊 Estrutura do Projeto

```
open-cleaner-rn/
├── src/                    # Frontend React
│   ├── pages/
│   │   ├── Dashboard.tsx   # Página principal de limpeza
│   │   ├── History.tsx     # Histórico de limpezas
│   │   └── Settings.tsx    # Configurações
│   └── services/
│       └── tauri.ts        # Interface com backend Rust
├── src-tauri/              # Backend Rust
│   ├── src/
│   │   ├── lib.rs          # Funções de limpeza
│   │   └── main.rs         # Entrada principal
│   └── tauri.conf.json     # Configuração do Tauri
└── public/                 # Assets estáticos
```

## 🎯 Funcionalidades Futuras

- [ ] Limpeza automática agendada
- [ ] Configurações personalizáveis por tipo de cache
- [ ] Relatórios de limpeza exportáveis
- [ ] Integração com CI/CD
- [ ] Suporte a projetos Flutter
- [ ] Backup antes da limpeza
- [ ] Exclusões personalizadas

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Clean RN Dev** - Mantenha seu ambiente de desenvolvimento React Native sempre limpo e otimizado! 🚀
