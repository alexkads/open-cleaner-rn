# Sistema de Versionamento Automático

Este projeto usa um sistema de versionamento automático baseado em tags Git que sincroniza automaticamente as versões entre todos os arquivos de configuração.

## Como Funciona

### 1. Versionamento Baseado em Tags
- **Tags de Release:** `v1.0.0`, `v1.2.3` etc.
- **Desenvolvimento:** `1.0.0-dev.45+abc123f` (baseado em commits desde a última tag)
- **Primeira versão:** `0.1.0-dev.1+abc123f` (quando não há tags)

### 2. Arquivos Sincronizados
O script `scripts/update-version.js` atualiza automaticamente:
- `package.json`
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`
- `src-tauri/tauri.release.conf.json` (se existir)

## Comandos Disponíveis

### Atualizar Versão Manualmente
```bash
pnpm version:update
```

### Criar Nova Tag de Release
```bash
# Exemplo: criar tag v1.2.0
git tag v1.2.0
git push origin v1.2.0
```

### Build com Versionamento
```bash
# Todos os comandos de build já incluem versionamento automático
pnpm build:all      # Build para todas as plataformas
pnpm build:mac      # Build para macOS
pnpm build:windows  # Build para Windows
pnpm build:linux    # Build para Linux
pnpm release        # Build de release
```

## Fluxo de Trabalho

### Para Desenvolvimento
1. Faça commits normalmente
2. Execute `pnpm build:all` - a versão será gerada automaticamente como `X.Y.Z-dev.N+hash`

### Para Release
1. Faça commit de todas as mudanças
2. Crie uma tag: `git tag v1.2.0`
3. Faça push da tag: `git push origin v1.2.0`
4. O GitHub Actions automaticamente:
   - Atualiza todas as versões para `1.2.0`
   - Builda para todas as plataformas
   - Cria release com instaladores
   - Atualiza documentação

## Formato de Versão

### Release (com tag)
```
1.2.3
```

### Desenvolvimento
```
1.2.3-dev.45+abc123f
│ │ │      │    └── Hash do commit
│ │ │      └────── Número de commits desde a última tag
│ │ └─────────── Patch version da última tag
│ └───────────── Minor version da última tag
└─────────────── Major version da última tag
```

## CI/CD Integration

O workflow `deploy.yml` automaticamente:
1. ✅ Atualiza versões baseado na tag/commit atual
2. ✅ Executa testes
3. ✅ Builda aplicação para todas as plataformas
4. ✅ Cria releases automaticamente
5. ✅ Inclui link para documentação nos releases

## Vantagens

- 🎯 **Consistência:** Todas as versões sempre sincronizadas
- 🚀 **Automático:** Zero intervenção manual necessária
- 📊 **Rastreável:** Versões de dev incluem hash do commit
- 🔄 **CI/CD Ready:** Integração completa com GitHub Actions
- 📱 **Multi-platform:** Funciona em todos os ambientes de build