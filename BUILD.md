# Build Guide - Clean RN Dev

Este guia explica como gerar instaladores para Mac, Windows e Linux do Clean RN Dev.

## 📋 Pré-requisitos

### Ferramentas Necessárias

1. **Node.js** (v18 ou superior)
2. **pnpm** (v8 ou superior)
3. **Rust** (stable)
4. **Tauri CLI**

### Instalação das Dependências

```bash
# Instalar Node.js e pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Instalar Tauri CLI
cargo install tauri-cli

# Configurar targets para cross-compilation
make setup-targets
```

### Dependências por Plataforma

#### macOS
```bash
# Xcode command line tools (já incluído no macOS)
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

#### Windows
```bash
# Visual Studio Build Tools ou Visual Studio Community
# Rust já inclui o toolchain necessário
```

## 🚀 Comandos de Build

### Comandos Rápidos (Makefile)

```bash
# Configuração inicial
make setup

# Desenvolvimento
make dev

# Build para plataforma atual
make build

# Build para todas as plataformas
make build-all

# Build específico por plataforma
make build-mac
make build-windows
make build-linux

# Build de produção
make release
```

### Comandos Detalhados (pnpm)

```bash
# Desenvolvimento
pnpm tauri dev

# Build para todas as plataformas
pnpm build:all

# Build específico por plataforma
pnpm build:mac          # macOS Universal
pnpm build:windows      # Windows x64
pnpm build:linux        # Linux x64
pnpm build:linux-arm    # Linux ARM64

# Build de produção com configuração otimizada
pnpm release
```

## 📦 Tipos de Instaladores Gerados

### macOS
- **`.dmg`** - Disk Image (padrão para distribuição)
- **`.app`** - Application Bundle
- **Universal Binary** - Suporta Intel e Apple Silicon

**Localização:** `src-tauri/target/universal-apple-darwin/release/bundle/`

### Windows
- **`.msi`** - Windows Installer (recomendado)
- **`.exe`** - NSIS Installer
- **`.exe`** - Standalone executable

**Localização:** `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/`

### Linux
- **`.deb`** - Debian Package (Ubuntu, Debian)
- **`.rpm`** - RPM Package (Fedora, CentOS, RHEL)
- **`.AppImage`** - Portable application (universal)

**Localização:** `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/`

## 🔧 Configuração Avançada

### Configurações de Build

As configurações de build estão em:
- `src-tauri/tauri.conf.json` - Configuração de desenvolvimento
- `src-tauri/tauri.release.conf.json` - Configuração de produção

### Assinatura de Código

#### macOS
```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Seu Nome",
      "providerShortName": "TeamID",
      "entitlements": "entitlements.plist"
    }
  }
}
```

#### Windows
```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "thumbprint-do-certificado",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

### Variáveis de Ambiente

```bash
# Para assinatura automatizada
export TAURI_PRIVATE_KEY="sua-chave-privada"
export TAURI_KEY_PASSWORD="senha-da-chave"

# Para builds de produção
export NODE_ENV=production
```

## 🤖 Build Automatizado (GitHub Actions)

### Workflow Automático

O arquivo `.github/workflows/build.yml` configura builds automáticos que:

1. **Dispara em:** Tags `v*` (ex: `v1.0.0`) ou manualmente
2. **Plataformas:** macOS, Windows, Linux
3. **Outputs:** Artifacts e GitHub Releases

### Como Criar uma Release

```bash
# 1. Atualizar versão no package.json e tauri.conf.json
# 2. Criar e enviar tag
git tag v1.0.0
git push origin v1.0.0

# 3. O GitHub Actions irá automaticamente:
#    - Compilar para todas as plataformas
#    - Executar testes
#    - Criar draft release
#    - Anexar instaladores
```

### Secrets Necessários

Configure no GitHub Repository Settings > Secrets:

```
TAURI_PRIVATE_KEY      # Para assinatura de updates
TAURI_KEY_PASSWORD     # Senha da chave privada
```

## 🛠️ Solução de Problemas

### Erros Comuns

#### "Failed to bundle project"
```bash
# Limpar cache e tentar novamente
make clean
make install
make build
```

#### "Cross compilation not available"
```bash
# Instalar targets necessários
make setup-targets
```

#### Erro de dependências no Linux
```bash
# Instalar dependências do sistema
sudo apt install libwebkit2gtk-4.0-dev libssl-dev
```

### Performance de Build

```bash
# Build paralelo mais rápido
export CARGO_BUILD_JOBS=4

# Cache do Rust para builds mais rápidos
export CARGO_TARGET_DIR=~/.cargo-target-cache
```

## 📊 Tamanhos dos Instaladores

| Plataforma | Formato | Tamanho Aproximado |
|------------|---------|-------------------|
| macOS      | .dmg    | ~15-25 MB        |
| Windows    | .msi    | ~12-20 MB        |
| Linux      | .deb    | ~10-18 MB        |
| Linux      | .AppImage| ~15-25 MB       |

## 🔍 Verificação dos Builds

### Teste Local
```bash
# Instalar e testar o instalador gerado
# macOS
open src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg

# Windows (no Windows)
start src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/*.msi

# Linux
sudo dpkg -i src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb/*.deb
```

### Verificação de Assinatura
```bash
# macOS - verificar assinatura
codesign -dv --verbose=4 path/to/app.app

# Windows - verificar certificado
signtool verify /pa path/to/installer.msi
```

## 📈 Monitoramento de Releases

### GitHub Releases
- Acesse: `https://github.com/seu-usuario/clean-rn-dev/releases`
- Downloads e estatísticas automáticas
- Changelogs gerados automaticamente

### Analytics
- Tauri fornece telemetria básica
- Use GitHub insights para estatísticas de download

## 🎯 Próximos Passos

1. **Auto-updates** - Configurar atualizações automáticas
2. **Notarização** - Para distribuição na Mac App Store
3. **Code Signing** - Certificados de produção
4. **CI/CD** - Pipeline completo de entrega

---

## 📞 Suporte

Para problemas de build:
1. Verifique os [pré-requisitos](#pré-requisitos)
2. Consulte [solução de problemas](#solução-de-problemas)
3. Abra uma issue no GitHub

**Links Úteis:**
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Rust Cross Compilation](https://rust-lang.github.io/rustup/cross-compilation.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)