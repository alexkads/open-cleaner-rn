# 🚨 **PNPM ONLY - STRICTLY ENFORCED**

> **⚠️ ATENÇÃO:** Este projeto usa **EXCLUSIVAMENTE pnpm**. O uso de npm ou yarn **NÃO é permitido** e **será bloqueado**.

## 🔒 **Enforcement Policies**

### **Configurações Ativas:**
- ✅ **engine-strict=true** - Bloqueia outros package managers
- ✅ **packageManager field** - Define pnpm como único permitido  
- ✅ **engines** - npm/yarn retornam erro "please-use-pnpm"
- ✅ **CI/CD** - Todos workflows usam pnpm
- ✅ **Pre-commit hooks** - Verificam uso correto

### **Consequências do Uso Incorreto:**
```bash
# ❌ Tentar usar npm:
npm install
# ERROR: npm please-use-pnpm

# ❌ Tentar usar yarn:  
yarn install
# ERROR: yarn please-use-pnpm
```

## 📋 **Comandos Obrigatórios**

### **✅ Instalação:**
```bash
# ROOT
pnpm install

# DOCS
cd docs-astro && pnpm install
```

### **✅ Desenvolvimento:**
```bash
# Modo dev
pnpm dev

# Build
pnpm build

# Testes
pnpm test
pnpm test:once
```

### **✅ Docs:**
```bash
cd docs-astro

# Dev
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## 🎯 **Razões para pnpm ONLY:**

### **🚀 Performance:**
- **3x mais rápido** que npm
- **Disk space eficiente** - symlinks para store central
- **Builds determinísticos** com pnpm-lock.yaml

### **🔧 Features:**
- **Workspace support** nativo
- **Peer dependencies** automáticas
- **Monorepo** otimizado
- **Security** melhorada

### **📊 Consistency:**
- **Um único lockfile** format
- **Dependências exatas** reproduzíveis
- **CI/CD** padronizado
- **Team alignment** garantido

## ⚙️ **Setup Inicial (Para Novos Devs):**

### **1. Instalar pnpm:**
```bash
# Via npm (only once)
npm install -g pnpm@8

# Via homebrew (macOS)
brew install pnpm

# Via winget (Windows)
winget install pnpm

# Via script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### **2. Verificar versão:**
```bash
pnpm --version
# Should be >= 8.0.0
```

### **3. Clone e setup:**
```bash
git clone <repo>
cd open-cleaner-rn
pnpm install  # ROOT
cd docs-astro && pnpm install  # DOCS
```

## 🚫 **NEVER DO THIS:**

```bash
# ❌ NEVER USE:
npm install
npm ci
yarn install
yarn add
npm run <script>
yarn <script>

# ❌ NEVER CREATE:
package-lock.json
yarn.lock
node_modules via npm/yarn
```

## ✅ **ALWAYS DO THIS:**

```bash
# ✅ ALWAYS USE:
pnpm install
pnpm add <package>
pnpm remove <package>
pnpm <script>
pnpm dlx <command>
```

## 🔍 **Troubleshooting:**

### **"Command not found: pnpm"**
```bash
# Install pnpm first:
npm install -g pnpm@8
```

### **"Engine strict error"**
```bash
# You're using wrong package manager!
# Use pnpm instead of npm/yarn
```

### **"Lock file out of sync"**
```bash
# Delete node_modules and reinstall:
rm -rf node_modules
pnpm install
```

### **CI/CD Issues**
- Verifique se workflow usa `pnpm/action-setup@v4`
- Confirme que usa `pnpm install --frozen-lockfile`
- Nunca use `npm ci` em workflows

## 📝 **Adding New Dependencies:**

### **Production Dependency:**
```bash
# ROOT
pnpm add <package>

# DOCS
cd docs-astro && pnpm add <package>
```

### **Dev Dependency:**
```bash
# ROOT
pnpm add -D <package>

# DOCS  
cd docs-astro && pnpm add -D <package>
```

### **Global Tool:**
```bash
pnpm add -g <package>
# or
pnpm dlx <package>  # run without installing
```

## 🚨 **Enforcement Checklist:**

- [ ] ✅ `.npmrc` with `engine-strict=true`
- [ ] ✅ `package.json` with correct engines
- [ ] ✅ `packageManager` field set
- [ ] ✅ CI/CD uses pnpm only
- [ ] ✅ Pre-commit hooks check package manager
- [ ] ✅ Team trained on pnpm only
- [ ] ✅ Documentation updated
- [ ] ✅ Lock files are pnpm-lock.yaml only

## 🎉 **Benefits Achieved:**

- 🚀 **3x faster installs** 
- 💾 **50% less disk usage**
- 🔒 **100% deterministic builds**
- 📦 **Perfect monorepo support**
- 🛡️ **Enhanced security**
- 🎯 **Team consistency**

---

> **Remember:** pnpm is not just a choice, it's a **REQUIREMENT**. No exceptions! 🔒
