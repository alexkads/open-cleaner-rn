#!/bin/bash

# 🛡️ Script simplificado para configurar Branch Protection
# Versão que funciona com a API atual do GitHub

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

log "Configurando proteção básica para $OWNER/$REPO_NAME"

# 1. Configurar métodos de merge primeiro
log "Configurando métodos de merge..."

gh api repos/$OWNER/$REPO_NAME \
  --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=true \
  --field delete_branch_on_merge=true \
  --field allow_auto_merge=true

success "Métodos de merge configurados!"

# 2. Configurar regras básicas do repositório
log "Configurando regras básicas..."

gh api repos/$OWNER/$REPO_NAME \
  --method PATCH \
  --field has_issues=true \
  --field has_projects=true \
  --field has_wiki=false \
  --field allow_forking=true

success "Regras básicas configuradas!"

# 3. Configurar proteção básica para main (sem status checks por enquanto)
log "Configurando proteção básica do branch 'main'..."

# Usar a API mais simples primeiro
gh api repos/$OWNER/$REPO_NAME/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field enforce_admins=true \
  --field restrictions=null \
  --field required_conversation_resolution=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field block_creations=false

success "Proteção básica do branch 'main' configurada!"

# 3.5. Verificar se branch 'dev' existe e configurar proteção
log "Verificando se branch 'dev' existe..."

if gh api repos/$OWNER/$REPO_NAME/branches/dev &> /dev/null; then
    log "Configurando proteção básica do branch 'dev'..."
    
    gh api repos/$OWNER/$REPO_NAME/branches/dev/protection \
      --method PUT \
      --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":false,"require_code_owner_reviews":false}' \
      --field enforce_admins=false \
      --field restrictions=null \
      --field required_conversation_resolution=true \
      --field allow_force_pushes=false \
      --field allow_deletions=false \
      --field block_creations=false

    success "Proteção básica do branch 'dev' configurada!"
else
    warning "Branch 'dev' não encontrado. Será configurado quando existir."
fi

# 4. Configurar labels padrão
log "Configurando labels padrão..."

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

success "Labels configurados!"

# 5. Mostrar como adicionar status checks manualmente
echo ""
echo "🎉 Configuração básica concluída!"
echo ""
echo "📋 O que foi configurado:"
echo "  ✅ Pull request reviews obrigatórios (1 aprovação)"
echo "  ✅ Code owners obrigatórios"  
echo "  ✅ Conversas devem ser resolvidas"
echo "  ✅ Squash merge habilitado"
echo "  ✅ Auto-delete de branches"
echo "  ✅ Labels padrão criados"
echo ""
echo "⚠️  Para adicionar status checks (depois que os workflows funcionarem):"
echo "  1. Vá para Settings > Branches no GitHub"
echo "  2. Edite a regra de proteção do 'main'"
echo "  3. Adicione os status checks:"
echo "     - 🧪 Automated Tests (ubuntu-latest)"
echo "     - 🧪 Automated Tests (windows-latest)"
echo "     - 🧪 Automated Tests (macos-latest)"
echo "     - 📋 PR Information Validation"
echo "     - 🔒 Security Check"
echo "     - ⚡ Performance Check"
echo ""
echo "🔗 Ou visite: https://github.com/$OWNER/$REPO_NAME/settings/branches"
