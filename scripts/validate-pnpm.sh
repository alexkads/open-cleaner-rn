#!/bin/bash

# Script para validar que apenas pnpm está sendo usado
# Usage: ./scripts/validate-pnpm.sh

set -e

echo "🚨 VALIDANDO USO EXCLUSIVO DE PNPM..."

ERRORS=0

# Verificar lockfiles
echo "📁 Verificando lockfiles..."
if [ -f "package-lock.json" ]; then
    echo "❌ ERRO: package-lock.json encontrado na raiz"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "yarn.lock" ]; then
    echo "❌ ERRO: yarn.lock encontrado na raiz"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "docs-astro/package-lock.json" ]; then
    echo "❌ ERRO: package-lock.json encontrado em docs-astro"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "docs-astro/yarn.lock" ]; then
    echo "❌ ERRO: yarn.lock encontrado em docs-astro"
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "pnpm-lock.yaml" ]; then
    echo "❌ ERRO: pnpm-lock.yaml não encontrado na raiz"
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "docs-astro/pnpm-lock.yaml" ]; then
    echo "❌ ERRO: pnpm-lock.yaml não encontrado em docs-astro"
    ERRORS=$((ERRORS + 1))
fi

# Verificar package.json engines
echo "⚙️ Verificando engines em package.json..."
if ! grep -q '"packageManager": "pnpm@' package.json; then
    echo "❌ ERRO: packageManager não definido como pnpm em package.json"
    ERRORS=$((ERRORS + 1))
fi

if ! grep -q '"npm": "please-use-pnpm"' package.json; then
    echo "❌ ERRO: engine npm não bloqueado em package.json"
    ERRORS=$((ERRORS + 1))
fi

# Verificar .npmrc
echo "🔧 Verificando .npmrc..."
if [ ! -f ".npmrc" ]; then
    echo "❌ ERRO: .npmrc não encontrado na raiz"
    ERRORS=$((ERRORS + 1))
elif ! grep -q "engine-strict=true" .npmrc; then
    echo "❌ ERRO: engine-strict não configurado em .npmrc"
    ERRORS=$((ERRORS + 1))
fi

# Verificar workflows
echo "🔄 Verificando workflows..."
if grep -r "npm install\|npm ci\|yarn install\|yarn add" .github/workflows/ --exclude="*.disabled" 2>/dev/null | grep -v "pnpm install"; then
    echo "❌ ERRO: Comandos npm/yarn encontrados em workflows ativos"
    ERRORS=$((ERRORS + 1))
fi

if ! grep -r "pnpm install\|pnpm add" .github/workflows/ --exclude="*.disabled" 2>/dev/null; then
    echo "❌ ERRO: Comandos pnpm não encontrados em workflows ativos"
    ERRORS=$((ERRORS + 1))
fi

# Verificar se pnpm está instalado
echo "💻 Verificando instalação do pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ ERRO: pnpm não está instalado"
    echo "🔧 Execute: npm install -g pnpm@8"
    ERRORS=$((ERRORS + 1))
else
    PNPM_VERSION=$(pnpm --version)
    echo "✅ pnpm versão: $PNPM_VERSION"
    
    # Verificar versão mínima
    if ! pnpm --version | grep -E "^[8-9]|^[1-9][0-9]" &> /dev/null; then
        echo "❌ ERRO: pnpm versão muito antiga ($PNPM_VERSION)"
        echo "🔧 Execute: npm install -g pnpm@8"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Resultado final
echo ""
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo "✅ VALIDAÇÃO PNPM: PASSOU!"
    echo "🎉 Projeto configurado corretamente para pnpm only"
    echo "======================================"
    exit 0
else
    echo "❌ VALIDAÇÃO PNPM: FALHOU!"
    echo "🚨 $ERRORS erro(s) encontrado(s)"
    echo "📖 Consulte PNPM_ONLY.md para correções"
    echo "======================================"
    exit 1
fi
