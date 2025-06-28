# Guia de Distribuição - Clean RN Dev

Este documento detalha como distribuir o Clean RN Dev para usuários finais.

## 📦 Formatos de Instaladores

### macOS
- **`.dmg`** - Formato preferido para distribuição
- **`.app`** - Bundle da aplicação (pode ser zipado)
- **Universal Binary** - Funciona em Intel e Apple Silicon

### Windows  
- **`.msi`** - Windows Installer (recomendado para empresas)
- **`.exe`** - NSIS Installer (recomendado para usuários)
- **Portable** - Executável standalone

### Linux
- **`.deb`** - Debian/Ubuntu packages
- **`.rpm`** - Red Hat/Fedora packages  
- **`.AppImage`** - Formato universal portátil

## 🚀 Processo de Release

### 1. Preparação da Release

```bash
# 1. Atualizar versão em todos os arquivos
./scripts/update-version.sh 1.0.0

# 2. Executar testes completos
make test

# 3. Build local para validação
make build-all

# 4. Commit das mudanças
git add .
git commit -m "chore: bump version to v1.0.0"

# 5. Criar tag
git tag v1.0.0
git push origin v1.0.0
```

### 2. Build Automático (GitHub Actions)

O push da tag dispara automaticamente:
- ✅ Build para macOS, Windows e Linux
- ✅ Execução de testes
- ✅ Criação de GitHub Release
- ✅ Upload de instaladores

### 3. Validação da Release

```bash
# Download e teste dos instaladores
# macOS
curl -L -o installer.dmg https://github.com/user/repo/releases/download/v1.0.0/clean-rn-dev_1.0.0_universal.dmg

# Windows  
curl -L -o installer.msi https://github.com/user/repo/releases/download/v1.0.0/clean-rn-dev_1.0.0_x64.msi

# Linux
curl -L -o installer.deb https://github.com/user/repo/releases/download/v1.0.0/clean-rn-dev_1.0.0_amd64.deb
```

## 🔐 Assinatura de Código

### macOS - Notarização

```bash
# 1. Configurar certificado de desenvolvedor
export APPLE_CERTIFICATE_PASSWORD="senha-do-certificado"
export APPLE_ID="seu-email@example.com" 
export APPLE_TEAM_ID="TEAM123456"

# 2. Build com assinatura
pnpm build:mac

# 3. Notarizar (automático no CI)
xcrun notarytool submit path/to/app.dmg \
  --apple-id "$APPLE_ID" \
  --team-id "$APPLE_TEAM_ID" \
  --password "$APPLE_APP_PASSWORD"
```

### Windows - Code Signing

```bash
# 1. Configurar certificado
export WINDOWS_CERTIFICATE="path/to/certificate.p12"
export WINDOWS_CERTIFICATE_PASSWORD="senha"

# 2. Build com assinatura
pnpm build:windows
```

## 📊 Estatísticas e Analytics

### GitHub Releases
- Downloads por versão
- Estatísticas de plataforma
- Dados demográficos de usuários

### Telemetria (Opcional)
```rust
// src-tauri/src/telemetry.rs
pub fn track_app_launch() {
    // Implementar telemetria respeitando privacidade
}
```

## 🌐 Canais de Distribuição

### 1. GitHub Releases (Primário)
- ✅ Gratuito e confiável
- ✅ Versionamento automático
- ✅ Changelog integrado
- ✅ Download direto

### 2. Package Managers

#### macOS - Homebrew
```bash
# Criar formula para Homebrew
brew tap user/repo
brew install clean-rn-dev
```

#### Windows - Chocolatey/Winget
```bash
# Chocolatey
choco install clean-rn-dev

# Winget
winget install CleanRNDev
```

#### Linux - Snap/Flatpak
```bash
# Snap
snap install clean-rn-dev

# Flatpak  
flatpak install clean-rn-dev
```

### 3. App Stores (Futuro)

#### Mac App Store
- Requer conta de desenvolvedor Apple
- Processo de review (~7 dias)
- Distribuição automática

#### Microsoft Store
- Requer conta de desenvolvedor Microsoft
- Processo de certificação
- Melhor descoberta no Windows

## 🔄 Atualizações Automáticas

### Configuração Tauri Updater

```json
// tauri.conf.json
{
  "updater": {
    "active": true,
    "endpoints": [
      "https://github.com/user/repo/releases/latest/download/latest.json"
    ],
    "dialog": true,
    "pubkey": "sua-chave-publica-aqui"
  }
}
```

### Geração de Signature
```bash
# Gerar par de chaves para updates
tauri signer generate -w ~/.tauri/myapp.key

# Assinar release
tauri signer sign -k ~/.tauri/myapp.key path/to/app
```

## 📋 Checklist de Release

### Pré-Release
- [ ] Versão atualizada em `package.json`
- [ ] Versão atualizada em `tauri.conf.json`
- [ ] Changelog atualizado
- [ ] Testes passando
- [ ] Build local validado
- [ ] Documentação atualizada

### Release
- [ ] Tag criada e pushed
- [ ] GitHub Actions executado com sucesso
- [ ] Todos os instaladores gerados
- [ ] Release notes preenchidas
- [ ] Instaladores testados manualmente

### Pós-Release
- [ ] Anúncio nas redes sociais
- [ ] Atualização da documentação
- [ ] Notificação aos usuários
- [ ] Monitoramento de issues

## 🛠️ Solução de Problemas

### Build Falhando
```bash
# Limpar cache e tentar novamente
rm -rf node_modules src-tauri/target
pnpm install
make build
```

### Assinatura Inválida
```bash
# Verificar certificados
# macOS
security find-identity -p codesigning

# Windows
certlm.msc
```

### Tamanho do Instalador
```bash
# Otimizar build
export CARGO_PROFILE_RELEASE_LTO=true
export CARGO_PROFILE_RELEASE_CODEGEN_UNITS=1
make release
```

## 📈 Métricas de Sucesso

### Downloads
- Total de downloads por versão
- Distribuição por plataforma
- Taxa de adoção de novas versões

### Feedback
- Issues reportadas no GitHub
- Reviews nas app stores
- Feedback da comunidade

### Performance
- Tempo de build no CI
- Tamanho dos instaladores
- Tempo de instalação

## 🎯 Roadmap de Distribuição

### Fase 1 (Atual)
- ✅ GitHub Releases
- ✅ Builds automáticos
- ✅ Multi-plataforma

### Fase 2
- [ ] Package managers
- [ ] Auto-updates
- [ ] Telemetria básica

### Fase 3  
- [ ] App stores
- [ ] Analytics avançadas
- [ ] A/B testing

---

## 🔗 Links Úteis

- [Tauri Release Guide](https://tauri.app/v1/guides/distribution/)
- [GitHub Actions for Tauri](https://github.com/tauri-apps/tauri-action)
- [Code Signing Best Practices](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)

Para dúvidas sobre distribuição, consulte a [documentação de build](BUILD.md) ou abra uma issue.