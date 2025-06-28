#!/bin/bash

# Clean RN Dev - Documentation Setup Script
# This script helps configure GitHub Pages for the project

set -e

echo "🚀 Setting up GitHub Pages for Clean RN Dev..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "This is not a git repository!"
        exit 1
    fi
    
    # Check if we have a remote origin
    if ! git remote get-url origin > /dev/null 2>&1; then
        print_error "No 'origin' remote found. Please add your GitHub repository as origin."
        exit 1
    fi
    
    print_status "Git repository detected ✅"
}

# Get repository information
get_repo_info() {
    REPO_URL=$(git remote get-url origin)
    print_status "Repository URL: $REPO_URL"
    
    # Extract owner and repo name from URL
    if [[ $REPO_URL =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
        REPO_OWNER="${BASH_REMATCH[1]}"
        REPO_NAME="${BASH_REMATCH[2]}"
        REPO_NAME="${REPO_NAME%.git}"  # Remove .git if present
        
        print_status "Repository Owner: $REPO_OWNER"
        print_status "Repository Name: $REPO_NAME"
        
        PAGES_URL="https://${REPO_OWNER}.github.io/${REPO_NAME}/"
        print_status "Expected GitHub Pages URL: $PAGES_URL"
    else
        print_error "Could not parse GitHub repository URL: $REPO_URL"
        exit 1
    fi
}

# Update documentation with repository-specific information
update_docs_content() {
    print_step "Updating documentation with repository information..."
    
    # Update HTML files
    find docs -name "*.html" -type f | while read -r file; do
        if [[ -f "$file" ]]; then
            # Replace placeholder repository references
            sed -i.bak "s|seu-usuario/clean-rn-dev|${REPO_OWNER}/${REPO_NAME}|g" "$file"
            sed -i.bak "s|seu-usuario\.github\.io/clean-rn-dev|${REPO_OWNER}.github.io/${REPO_NAME}|g" "$file"
            rm "${file}.bak" 2>/dev/null || true
            print_status "Updated: $file"
        fi
    done
    
    # Update JavaScript files
    if [[ -f "docs/assets/script.js" ]]; then
        sed -i.bak "s|seu-usuario|${REPO_OWNER}|g" docs/assets/script.js
        sed -i.bak "s|clean-rn-dev|${REPO_NAME}|g" docs/assets/script.js
        rm "docs/assets/script.js.bak" 2>/dev/null || true
        print_status "Updated: docs/assets/script.js"
    fi
    
    # Update README files
    if [[ -f "docs/README.md" ]]; then
        sed -i.bak "s|YOUR-USERNAME|${REPO_OWNER}|g" docs/README.md
        sed -i.bak "s|clean-rn-dev|${REPO_NAME}|g" docs/README.md
        rm "docs/README.md.bak" 2>/dev/null || true
        print_status "Updated: docs/README.md"
    fi
    
    print_status "Documentation content updated ✅"
}

# Create CNAME file if custom domain is specified
setup_custom_domain() {
    if [[ -n "$1" ]]; then
        echo "$1" > docs/CNAME
        print_status "Created CNAME file for custom domain: $1"
        print_warning "Remember to configure DNS settings for your custom domain!"
    fi
}

# Commit and push documentation changes
commit_and_push() {
    print_step "Committing documentation changes..."
    
    # Check if there are changes to commit
    if ! git diff --quiet docs/ || ! git diff --cached --quiet docs/; then
        git add docs/
        git commit -m "docs: Setup GitHub Pages with repository-specific configuration

- Update repository URLs and references
- Configure automated documentation deployment
- Add GitHub Pages workflow

🤖 Generated with Clean RN Dev setup script"
        
        print_status "Changes committed ✅"
        
        # Ask if user wants to push
        read -p "Push changes to GitHub? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin main
            print_status "Changes pushed to GitHub ✅"
        else
            print_warning "Changes committed locally but not pushed."
            print_warning "Run 'git push origin main' when ready."
        fi
    else
        print_status "No changes detected in documentation."
    fi
}

# Check GitHub Pages status
check_pages_status() {
    print_step "Checking GitHub Pages configuration..."
    
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. 🔧 Enable GitHub Pages:"
    echo "   • Go to: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/pages"
    echo "   • Source: Deploy from a branch"
    echo "   • Branch: gh-pages (will be created automatically)"
    echo ""
    echo "2. 🚀 Trigger Documentation Build:"
    echo "   • Push changes to main branch (documentation workflow will run)"
    echo "   • Or manually trigger from: https://github.com/${REPO_OWNER}/${REPO_NAME}/actions"
    echo ""
    echo "3. 🌐 Access Documentation:"
    echo "   • URL: ${PAGES_URL}"
    echo "   • May take 5-10 minutes for first deployment"
    echo ""
    echo "4. 🔄 Automatic Updates:"
    echo "   • Documentation updates automatically on:"
    echo "     - Changes to docs/ directory"
    echo "     - New releases (updates download links)"
    echo "     - Manual workflow dispatch"
    echo ""
    
    if command -v gh &> /dev/null; then
        print_status "GitHub CLI detected. You can also enable Pages with:"
        echo "   gh repo edit --enable-pages --pages-branch gh-pages"
    fi
}

# Main execution
main() {
    echo "📚 Clean RN Dev - GitHub Pages Setup"
    echo "===================================="
    echo ""
    
    # Parse command line arguments
    CUSTOM_DOMAIN=""
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                CUSTOM_DOMAIN="$2"
                shift 2
                ;;
            --help|-h)
                echo "Usage: $0 [--domain CUSTOM_DOMAIN]"
                echo ""
                echo "Options:"
                echo "  --domain DOMAIN    Set up custom domain for GitHub Pages"
                echo "  --help, -h         Show this help message"
                echo ""
                echo "Examples:"
                echo "  $0                              # Basic setup"
                echo "  $0 --domain clean-rn-dev.com   # Setup with custom domain"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Execute setup steps
    check_git_repo
    get_repo_info
    update_docs_content
    
    if [[ -n "$CUSTOM_DOMAIN" ]]; then
        setup_custom_domain "$CUSTOM_DOMAIN"
    fi
    
    commit_and_push
    check_pages_status
    
    echo ""
    print_status "🎉 GitHub Pages setup completed!"
    print_status "Your documentation will be available at: ${PAGES_URL}"
    echo ""
}

# Run main function with all arguments
main "$@"