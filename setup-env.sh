#!/bin/bash

# Script para configurar variáveis de ambiente do Clean RN

echo "🔧 Configurando variáveis de ambiente para Clean RN..."
echo ""

# Verificar se o arquivo .env já existe
if [ -f ".env" ]; then
    echo "⚠️  Arquivo .env já existe!"
    read -p "Deseja sobrescrever? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Operação cancelada"
        exit 1
    fi
fi

# Copiar arquivo de exemplo
if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ Arquivo .env criado com sucesso!"
else
    echo "❌ Arquivo env.example não encontrado!"
    exit 1
fi

echo ""
echo "🎭 Configuração atual:"
echo "   VITE_USE_MOCK=1 (usando serviços mock)"
echo ""
echo "📝 Para alternar entre mock e serviços reais:"
echo "   1. Edite o arquivo .env"
echo "   2. Mude VITE_USE_MOCK=1 para VITE_USE_MOCK=0"
echo "   3. Reinicie o servidor: npm run dev"
echo ""
echo "🚀 Para iniciar o servidor:"
echo "   npm run dev"
echo ""
echo "📖 Para mais informações, consulte ENV_SETUP.md" 