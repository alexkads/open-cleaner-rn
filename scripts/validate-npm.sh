#!/bin/bash
# Script para validar que npm está sendo usado consistentemente
# Usage: ./scripts/validate-npm.sh

set -e

echo "📦 VALIDANDO PADRONIZAÇÃO NPM..."

ERROR_COUNT=0

# Função para reportar erros
report_error() {
    echo "❌ ERRO: $1"
    ((ERROR_COUNT++))
}

# Função para reportar sucesso
report_success() {
    echo "✅ $1"
}

# Verificar se não há pnpm-lock.yaml
echo "🔍 Verificando ausência de pnpm-lock.yaml..."
if [ -f "pnpm-lock.yaml" ]; then
    report_error "pnpm-lock.yaml encontrado na raiz - deve ser removido"
else
    report_success "Nenhum pnpm-lock.yaml na raiz"
fi

if [ -f "docs-astro/pnpm-lock.yaml" ]; then
    report_error "pnpm-lock.yaml encontrado em docs-astro - deve ser removido"
else
    report_success "Nenhum pnpm-lock.yaml em docs-astro"
fi

# Verificar se não há yarn.lock
echo "🔍 Verificando ausência de yarn.lock..."
if [ -f "yarn.lock" ]; then
    report_error "yarn.lock encontrado - deve ser removido"
else
    report_success "Nenhum yarn.lock encontrado"
fi

# Verificar presença de package-lock.json
echo "🔍 Verificando presença de package-lock.json..."
if [ ! -f "package-lock.json" ]; then
    report_error "package-lock.json não encontrado na raiz"
else
    report_success "package-lock.json presente na raiz"
fi

if [ ! -f "docs-astro/package-lock.json" ]; then
    report_error "package-lock.json não encontrado em docs-astro"
else
    report_success "package-lock.json presente em docs-astro"
fi

# Verificar se packageManager não está definido (deixa npm como padrão)
echo "🔍 Verificando configuração de package manager..."
if grep -q '"packageManager":' package.json; then
    report_error "packageManager definido em package.json - deve ser removido para usar npm padrão"
else
    report_success "Nenhum packageManager específico definido (usa npm padrão)"
fi

# Verificar workflows ativos
echo "🔍 Verificando workflows do GitHub Actions..."
if [ -d ".github/workflows" ]; then
    if grep -r "pnpm install\|pnpm add\|pnpm run" .github/workflows/ --exclude="*.disabled" 2>/dev/null; then
        report_error "Comandos pnpm encontrados em workflows ativos"
    else
        report_success "Nenhum comando pnpm em workflows ativos"
    fi
    
    if ! grep -r "npm install\|npm run" .github/workflows/ --exclude="*.disabled" 2>/dev/null; then
        report_error "Comandos npm não encontrados em workflows ativos"
    else
        report_success "Comandos npm encontrados em workflows"
    fi
fi

# Verificar se npm está disponível
echo "💻 Verificando instalação do npm..."
if ! command -v npm &> /dev/null; then
    report_error "npm não está instalado"
else
    NPM_VERSION=$(npm --version)
    report_success "npm versão: $NPM_VERSION"
    
    # Verificar versão mínima do npm
    if ! npm --version | grep -E "^[8-9]|^[1-9][0-9]" &> /dev/null; then
        report_error "npm versão muito antiga ($NPM_VERSION) - recomendado >= 8.0.0"
    else
        report_success "npm versão adequada"
    fi
fi

# Resultado final
echo ""
echo "===================="
if [ $ERROR_COUNT -eq 0 ]; then
    echo "✅ VALIDAÇÃO NPM: PASSOU!"
    echo "🎉 Projeto padronizado corretamente para npm"
    exit 0
else
    echo "❌ VALIDAÇÃO NPM: FALHOU!"
    echo "🔢 Total de erros: $ERROR_COUNT"
    echo "📖 Consulte NPM_ONLY.md para correções"
    exit 1
fi
