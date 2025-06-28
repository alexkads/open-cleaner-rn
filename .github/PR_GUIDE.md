# 🚀 Guia de Pull Requests

Este guia explica como criar e gerenciar Pull Requests (PRs) efetivos no projeto Open Cleaner RN.

## 📋 Antes de Criar um PR

### 1. Preparação
- [ ] Issue relacionada existe e está atribuída a você
- [ ] Branch criada a partir da `main` ou `develop`
- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Lint e formatação OK

### 2. Nomenclatura de Branch
Use o padrão: `tipo/nome-descritivo`

**Tipos permitidos:**
- `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração
- `perf/` - Melhoria de performance
- `test/` - Adição/correção de testes
- `chore/` - Tarefas de manutenção

**Exemplos:**
```bash
feature/add-cache-visualization
fix/memory-leak-dashboard
docs/update-installation-guide
refactor/simplify-file-scanner
```

## 🎯 Tipos de PR e Templates

### 🐛 Bug Fix
Use: `.github/pull_request_template/bugfix.md`
- Descreva o problema original
- Explique a causa raiz
- Demonstre a correção
- Inclua testes de regressão

### ✨ Feature
Use: `.github/pull_request_template/feature.md`
- Descreva a nova funcionalidade
- Justifique sua necessidade
- Mostre screenshots/demos
- Documente uso

### 📚 Documentation
Use: `.github/pull_request_template/documentation.md`
- Identifique o público-alvo
- Verifique links e exemplos
- Mantenha consistência de estilo

### ♻️ Refactoring
Use: `.github/pull_request_template/refactoring.md`
- Explique o problema atual
- Mostre a melhoria
- Prove que nada quebrou
- Meça o impacto

## 🏗️ Como Usar Templates Específicos

### Método 1: URL com Template
Ao criar o PR, adicione `?template=nome_do_template.md` na URL:

```
https://github.com/alexkads/open-cleaner-rn/compare/main...sua-branch?template=feature.md
```

### Método 2: Manual
1. Crie o PR normalmente
2. Apague o conteúdo padrão
3. Copie e cole o template específico
4. Preencha as seções

## 📝 Boas Práticas para Descrição

### ✅ Faça
- **Título claro**: Use convenção `type: description`
- **Contexto suficiente**: Explique o "porquê", não apenas o "o quê"
- **Screenshots**: Para mudanças visuais
- **Links úteis**: Issues, documentação, referencias
- **Checklist**: Use checkboxes para tracking
- **Instruções de teste**: Como revisar/testar

### ❌ Evite
- Títulos vagos: "Fix", "Update", "Changes"
- Descrições minimalistas: "WIP", "pequena correção"
- Falta de contexto: Assumir que reviewer conhece o background
- PRs gigantes: Mantenha PRs focados e pequenos
- Commits desnecessários: Use squash para limpar histórico

## 🧪 Checklist de Qualidade

### Antes de Submeter
- [ ] **Código**
  - [ ] Funciona como esperado
  - [ ] Segue padrões do projeto
  - [ ] Não introduz warnings
  - [ ] Performance não degradada

- [ ] **Testes**
  - [ ] Testes unitários passando
  - [ ] Testes de integração (se aplicável)
  - [ ] Coverage mantido/melhorado
  - [ ] Testado em diferentes plataformas

- [ ] **Documentação**
  - [ ] Código comentado quando necessário
  - [ ] README atualizado (se necessário)
  - [ ] API docs atualizadas
  - [ ] Changelog atualizado

- [ ] **Segurança**
  - [ ] Não expõe dados sensíveis
  - [ ] Input validation adequada
  - [ ] Dependências seguras

### Durante Review
- [ ] **Colaboração**
  - [ ] Responder comentários prontamente
  - [ ] Explicar decisões técnicas
  - [ ] Aceitar feedback construtivo
  - [ ] Iterar baseado em sugestões

## 🔄 Processo de Review

### 1. Preparação para Review
```bash
# Certifique-se que está atualizado
git checkout main
git pull origin main
git checkout sua-branch
git rebase main

# Execute testes localmente
pnpm test
pnpm lint
pnpm build

# Push das mudanças
git push origin sua-branch
```

### 2. Durante o Review
- **Seja responsivo**: Responda a comentários em 24h
- **Seja específico**: Pergunte claramente quando em dúvida
- **Seja educado**: Use linguagem construtiva
- **Seja defensivo**: Explique decisões quando necessário

### 3. Addressing Feedback
```bash
# Faça mudanças baseadas no feedback
git add .
git commit -m "Address review feedback: fix error handling"
git push origin sua-branch

# Para pequenos fixes, considere squash depois
git rebase -i HEAD~n  # onde n é número de commits
```

## 🚀 Merge Strategy

### Quando o PR Está Pronto
1. **Final check**: Todos os status checks verdes
2. **Approval**: Pelo menos 1 approval de code owner
3. **Conflicts**: Resolvidos (rebase se necessário)
4. **Conversations**: Todas resolvidas

### Tipos de Merge
- **Squash and Merge** (recomendado): Para features e fixes
- **Rebase and Merge**: Para manter histórico linear
- **Merge Commit**: Evitado (gera ruído no histórico)

### Após o Merge
```bash
# Limpar branch local
git checkout main
git pull origin main
git branch -d sua-branch

# Branch remota é deletada automaticamente
```

## 📊 Métricas e Qualidade

### Status Checks Obrigatórios
- ✅ Testes automatizados (todas as plataformas)
- ✅ Lint e formatação
- ✅ Type checking
- ✅ Security audit
- ✅ Build verification

### Quality Gates
- **Coverage**: Mínimo 80% (frontend), 75% (backend)
- **Performance**: Bundle size não pode aumentar >10%
- **Security**: Nenhuma vulnerabilidade crítica/alta

## 🆘 Troubleshooting

### PR Status Checks Falhando
```bash
# Verificar testes localmente
pnpm test

# Verificar lint
pnpm lint --fix

# Verificar build
pnpm build

# Verificar types
pnpm type-check
```

### Conflicts de Merge
```bash
# Rebase contra main
git checkout main
git pull origin main
git checkout sua-branch
git rebase main

# Resolver conflicts
# Edit conflicted files
git add .
git rebase --continue

# Force push (cuidado!)
git push --force-with-lease origin sua-branch
```

### Review Demorado
- **Ping reviewers**: Use @mentions educadamente
- **Break down**: PRs menores são revisados mais rápido
- **Self-review**: Adicione comentários explicativos
- **Documentation**: Inclua contexto suficiente

## 🎓 Exemplos de PRs Exemplares

### Feature PR Exemplo
```markdown
# feat: Add system resource monitoring dashboard

## 📋 Descrição da Feature
Adiciona uma nova dashboard que mostra uso de CPU, memória e disco em tempo real.

## 🎯 Problema Resolvido
Usuários precisam monitorar o impacto do app no sistema (#234)

## 🔧 Implementação
- Nova tela `ResourceMonitor.tsx`
- Hook `useSystemResources()` para polling de dados
- Service `systemInfo.ts` para interface com Tauri
- Charts com Recharts para visualização

## 📸 Screenshots
[Include screenshots here]

## 🧪 Como Testar
1. Execute `pnpm dev`
2. Navegue para Settings > System Monitor
3. Verifique se dados são atualizados a cada 2s
4. Teste com aplicações pesadas rodando
```

### Bug Fix PR Exemplo
```markdown
# fix: Memory leak in file scanner component

## 🐛 Problema
Scanner de arquivos não limpa listeners quando componente é desmontado, causando memory leak.

## 🔍 Root Cause
`useEffect` sem cleanup function para WebSocket connection.

## 🛠️ Solução
Adicionado cleanup no `useEffect` e AbortController para cancelar requests.

## 📊 Evidência
- Antes: Memory usage crescia continuamente
- Depois: Memory usage estável após navigation

## 🧪 Teste
1. Abrir DevTools > Memory
2. Navegar entre telas múltiplas vezes
3. Verificar que memory não cresce indefinidamente
```

## 📚 Recursos Adicionais

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)
- [Writing Good PR Descriptions](https://chris.beams.io/posts/git-commit/)
