# 🛡️ Guia para Evitar Conflitos de Merge

## 📋 Workflow Diário Recomendado

### 1. **Antes de Começar a Trabalhar**
```bash
# Sempre sincronize antes de começar
git checkout main
git pull origin main
git checkout dev  
./scripts/sync-dev.sh
```

### 2. **Durante o Desenvolvimento**
```bash
# Commits pequenos e frequentes
git add .
git commit -m "feat: add specific feature X"

# Sincronize a cada 2-3 horas
./scripts/sync-dev.sh
```

### 3. **Antes do Merge/PR**
```bash
# Última sincronização
./scripts/sync-dev.sh

# Testes finais
npm test
npm run build

# Push para review
git push origin dev
```

## 🎯 Boas Práticas Específicas

### ✅ **DO (Faça)**
- ✅ Commits atômicos (uma mudança por commit)
- ✅ Rebase frequente da branch de trabalho
- ✅ Use conventional commits (`feat:`, `fix:`, `docs:`)
- ✅ Teste localmente antes do push
- ✅ PRs pequenos (máximo 400 linhas)
- ✅ Comunicação com time sobre arquivos compartilhados

### ❌ **DON'T (Não Faça)**
- ❌ Commits gigantes com múltiplas mudanças
- ❌ Editar arquivos de lock simultaneamente
- ❌ Trabalhar dias sem sincronizar com main
- ❌ Force push em branches compartilhadas
- ❌ Merge de branches desatualizadas

## 🔧 Configurações Úteis

### Merge Tool
```bash
# Configure uma ferramenta visual para resolver conflitos
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### Auto-rebase
```bash
# Configure rebase automático em pulls
git config --global pull.rebase true
```

### Aliases Úteis
```bash
git config --global alias.sync '!git fetch origin && git rebase origin/main'
git config --global alias.conflicts '!git diff --name-only --diff-filter=U'
git config --global alias.resolve 'add'
```

## 🚨 Em Caso de Conflito

### 1. **Não entre em pânico!**
```bash
# Veja quais arquivos têm conflito
git status

# Use ferramenta visual
git mergetool
```

### 2. **Resolução Manual**
```bash
# Edite arquivos com conflito
# Procure por: <<<<<<< HEAD
# Remove marcadores e escolha versão correta

# Marque como resolvido
git add arquivo-resolvido.txt

# Continue o processo
git rebase --continue  # ou git merge --continue
```

### 3. **Teste Sempre**
```bash
# Após resolver conflitos
npm install
npm test
npm run build
```

## 📊 Monitoramento

### Dashboard de Conflitos
- Use GitHub Insights para ver padrões
- Monitore arquivos que causam mais conflitos
- Considere refatorar arquivos problemáticos

### Métricas Úteis
- Frequência de conflitos por arquivo
- Tempo médio para resolver conflitos  
- Número de commits entre merges
