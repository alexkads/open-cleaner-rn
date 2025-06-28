#!/bin/bash

# Script para sincronizar branch de desenvolvimento
# Use: ./scripts/sync-dev.sh

set -e

echo "🔄 Sincronizando branch dev com main..."

# Buscar últimas mudanças
git fetch origin

# Verificar se estamos na branch dev
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo "❌ Execute este script na branch dev"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Há mudanças não commitadas. Commit ou stash primeiro."
    git status --short
    exit 1
fi

# Fazer rebase da dev com main
echo "🔄 Fazendo rebase com origin/main..."
git rebase origin/main

if [ $? -eq 0 ]; then
    echo "✅ Rebase concluído com sucesso!"
    echo "💡 Agora você pode continuar trabalhando sem conflitos"
else
    echo "❌ Conflitos detectados durante rebase."
    echo "🛠️  Resolva os conflitos e execute: git rebase --continue"
    exit 1
fi
