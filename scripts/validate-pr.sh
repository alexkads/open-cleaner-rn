#!/bin/bash

# 🔍 Script de validação pré-PR
# Execute este script antes de criar um PR para verificar se tudo está OK

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Contador de problemas
ISSUES=0

echo "🔍 Validação Pré-PR - Open Cleaner RN"
echo "====================================="
echo ""

# 1. Verificar se está na branch correta
log "Verificando branch atual..."
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "develop" ]]; then
    error "Você está na branch '$CURRENT_BRANCH'. Crie uma feature branch primeiro!"
    echo "  Solução: git checkout -b feature/nome-da-sua-feature"
    ISSUES=$((ISSUES + 1))
else
    success "Branch '$CURRENT_BRANCH' OK"
fi

# 2. Verificar se há mudanças commitadas
log "Verificando mudanças não commitadas..."
if ! git diff-index --quiet HEAD --; then
    error "Há mudanças não commitadas"
    echo "  Solução: git add . && git commit -m 'sua mensagem'"
    ISSUES=$((ISSUES + 1))
else
    success "Todas as mudanças estão commitadas"
fi

# 3. Verificar se está atualizado com main
log "Verificando se está atualizado com main..."
git fetch origin main --quiet
BEHIND_COUNT=$(git rev-list --count HEAD..origin/main)
if [ "$BEHIND_COUNT" -gt 0 ]; then
    warning "Sua branch está $BEHIND_COUNT commits atrás da main"
    echo "  Recomendação: git rebase origin/main"
fi

# 4. Verificar dependências
log "Verificando dependências..."
if [ ! -d "node_modules" ]; then
    error "node_modules não encontrado"
    echo "  Solução: pnpm install"
    ISSUES=$((ISSUES + 1))
else
    success "Dependências instaladas"
fi

# 5. Verificar lint
log "Executando lint check..."
if pnpm lint > /dev/null 2>&1; then
    success "Lint check passou"
else
    error "Lint check falhou"
    echo "  Solução: pnpm lint --fix"
    ISSUES=$((ISSUES + 1))
fi

# 6. Verificar formatação
log "Verificando formatação..."
if pnpm format:check > /dev/null 2>&1; then
    success "Formatação OK"
else
    error "Formatação inconsistente"
    echo "  Solução: pnpm format"
    ISSUES=$((ISSUES + 1))
fi

# 7. Verificar types
log "Verificando TypeScript..."
if pnpm type-check > /dev/null 2>&1; then
    success "Type check passou"
else
    error "Type check falhou"
    echo "  Verifique erros de tipo no código"
    ISSUES=$((ISSUES + 1))
fi

# 8. Executar testes
log "Executando testes..."
if pnpm test:once > /dev/null 2>&1; then
    success "Todos os testes passaram"
else
    error "Alguns testes falharam"
    echo "  Execute: pnpm test para mais detalhes"
    ISSUES=$((ISSUES + 1))
fi

# 9. Verificar build
log "Testando build..."
if pnpm build > /dev/null 2>&1; then
    success "Build foi bem-sucedido"
else
    error "Build falhou"
    echo "  Execute: pnpm build para mais detalhes"
    ISSUES=$((ISSUES + 1))
fi

# 10. Verificar se Rust compila (se há mudanças no Tauri)
if [ -d "src-tauri" ] && git diff --name-only HEAD origin/main | grep -q "src-tauri/"; then
    log "Verificando código Rust..."
    if (cd src-tauri && cargo check > /dev/null 2>&1); then
        success "Código Rust compila"
    else
        error "Código Rust não compila"
        echo "  Execute: cd src-tauri && cargo check"
        ISSUES=$((ISSUES + 1))
    fi
fi

# 11. Verificar tamanho dos commits
log "Verificando tamanho dos commits..."
LARGE_FILES=$(git diff --name-only HEAD origin/main | xargs -I {} find {} -size +1M 2>/dev/null || true)
if [ -n "$LARGE_FILES" ]; then
    warning "Arquivos grandes detectados:"
    echo "$LARGE_FILES"
    echo "  Considere usar Git LFS para arquivos grandes"
fi

# 12. Verificar mensagens de commit
log "Verificando mensagens de commit..."
COMMITS=$(git log --oneline origin/main..HEAD)
if [ -z "$COMMITS" ]; then
    warning "Nenhum commit novo encontrado"
else
    echo "Commits que serão incluídos no PR:"
    echo "$COMMITS"
    echo ""
fi

# 13. Verificar se há TODO/FIXME
log "Verificando TODOs e FIXMEs..."
TODO_COUNT=$(git diff origin/main HEAD | grep -E "^\+.*TODO|^\+.*FIXME" | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
    warning "$TODO_COUNT TODOs/FIXMEs adicionados"
    echo "  Considere resolver antes do PR"
fi

# 14. Verificar coverage (se disponível)
if [ -f "coverage/lcov-report/index.html" ]; then
    log "Coverage disponível em coverage/lcov-report/index.html"
fi

echo ""
echo "====================================="

# Resumo final
if [ "$ISSUES" -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo pronto para o PR!${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "  1. git push origin $CURRENT_BRANCH"
    echo "  2. Criar PR no GitHub"
    echo "  3. Escolher template apropriado"
    echo "  4. Preencher descrição detalhada"
    echo ""
    echo "📚 Templates disponíveis:"
    echo "  • Bug fix: ?template=bugfix.md"
    echo "  • Feature: ?template=feature.md"
    echo "  • Documentation: ?template=documentation.md"
    echo "  • Refactoring: ?template=refactoring.md"
else
    echo -e "${RED}❌ $ISSUES problema(s) encontrado(s)${NC}"
    echo ""
    echo "🔧 Resolva os problemas acima antes de criar o PR"
    exit 1
fi

echo ""
echo "📖 Guia completo: .github/PR_GUIDE.md"
