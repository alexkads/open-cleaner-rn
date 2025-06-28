#!/bin/bash

# 🛡️ Script para configurar Branch Protection e regras de merge
# Execute este script para aplicar todas as configurações de proteção de branch

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    error "GitHub CLI (gh) não está instalado. Instale primeiro: https://cli.github.com/"
    exit 1
fi

# Verificar se está autenticado
if ! gh auth status &> /dev/null; then
    error "Não está autenticado no GitHub CLI. Execute: gh auth login"
    exit 1
fi

# Obter informações do repositório
REPO_INFO=$(gh repo view --json owner,name)
OWNER=$(echo "$REPO_INFO" | jq -r '.owner.login')
REPO_NAME=$(echo "$REPO_INFO" | jq -r '.name')

log "Configurando proteção de branch para $OWNER/$REPO_NAME"

# 1. Configurar proteção do branch main
log "Configurando proteção do branch 'main'..."

gh api repos/$OWNER/$REPO_NAME/branches/main/protection \
  --method PUT \
  --raw-field required_status_checks='{"strict":true,"contexts":["🧪 Automated Tests (ubuntu-latest)","🧪 Automated Tests (windows-latest)","🧪 Automated Tests (macos-latest)","📋 PR Information Validation","🔒 Security Check","⚡ Performance Check"]}' \
  --field enforce_admins=true \
  --raw-field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"require_last_push_approval":false}' \
  --field restrictions=null \
  --field required_conversation_resolution=true \
  --field block_creations=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false

success "Proteção do branch 'main' configurada!"

# 2. Configurar proteção do branch develop (se existir)
log "Verificando se branch 'develop' existe..."

if gh api repos/$OWNER/$REPO_NAME/branches/develop &> /dev/null; then
    log "Configurando proteção do branch 'develop'..."
    
    gh api repos/$OWNER/$REPO_NAME/branches/develop/protection \
      --method PUT \
      --raw-field required_status_checks='{"strict":true,"contexts":["🧪 Automated Tests (ubuntu-latest)","📋 PR Information Validation","🔒 Security Check"]}' \
      --field enforce_admins=false \
      --raw-field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":false,"require_code_owner_reviews":false}' \
      --field restrictions=null \
      --field required_conversation_resolution=true

    success "Proteção do branch 'develop' configurada!"
else
    warning "Branch 'develop' não encontrado, pulando configuração"
fi

# 3. Configurar métodos de merge permitidos
log "Configurando métodos de merge..."

gh api repos/$OWNER/$REPO_NAME \
  --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=true \
  --field delete_branch_on_merge=true \
  --field allow_auto_merge=true \
  --field squash_merge_commit_title="PR_TITLE" \
  --field squash_merge_commit_message="PR_BODY"

success "Métodos de merge configurados!"

# 4. Configurar regras gerais do repositório
log "Configurando regras gerais do repositório..."

gh api repos/$OWNER/$REPO_NAME \
  --method PATCH \
  --field has_issues=true \
  --field has_projects=true \
  --field has_wiki=false \
  --field allow_forking=true \
  --field web_commit_signoff_required=false

success "Regras gerais configuradas!"

# 5. Configurar labels padrão se não existirem
log "Verificando labels padrão..."

LABELS=(
    "bug:Bug fix:d73a4a"
    "feature:New feature:0075ca" 
    "documentation:Documentation:0052cc"
    "refactoring:Code refactoring:fbca04"
    "performance:Performance improvement:d4c5f9"
    "security:Security related:b60205"
    "hotfix:Critical hotfix:e99695"
    "dependencies:Dependencies update:0366d6"
    "ui:User interface:7057ff"
    "backend:Backend changes:8b5cf6"
    "frontend:Frontend changes:1d76db"
    "testing:Testing related:c2e0c6"
    "ci:CI/CD related:28a745"
    "breaking:Breaking change:f9f9f9"
)

for label in "${LABELS[@]}"; do
    IFS=':' read -r name description color <<< "$label"
    
    if ! gh api repos/$OWNER/$REPO_NAME/labels/$name &> /dev/null; then
        gh api repos/$OWNER/$REPO_NAME/labels \
          --method POST \
          --field name="$name" \
          --field description="$description" \
          --field color="$color" &> /dev/null
        log "Label '$name' criado"
    fi
done

success "Labels verificados/criados!"

# 6. Configurar webhook de segurança (opcional)
log "Configurações de segurança adicionais..."

gh api repos/$OWNER/$REPO_NAME \
  --method PATCH \
  --field security_and_analysis='{
    "secret_scanning": {"status": "enabled"},
    "secret_scanning_push_protection": {"status": "enabled"}
  }' &> /dev/null || warning "Algumas configurações de segurança podem não estar disponíveis"

# 7. Resumo final
echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📋 Resumo das configurações aplicadas:"
echo "  ✅ Proteção de branch 'main' com reviews obrigatórios"
echo "  ✅ Status checks obrigatórios configurados"
echo "  ✅ Squash merge habilitado (merge commits desabilitados)"
echo "  ✅ Auto-delete de branches após merge"
echo "  ✅ Code owners ativados"
echo "  ✅ Labels padrão criados"
echo "  ✅ Configurações de segurança aplicadas"
echo ""
echo "🔗 Próximos passos:"
echo "  1. Revisar arquivo .github/CODEOWNERS"
echo "  2. Verificar se todos os status checks estão funcionando"
echo "  3. Testar processo de PR com as novas regras"
echo ""
echo "📚 Documentação: .github/BRANCH_PROTECTION.md"
