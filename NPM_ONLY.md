# 📦 **NPM PADRÃO - PROJETO PADRONIZADO**

> **✅ PADRONIZAÇÃO:** Este projeto usa **EXCLUSIVAMENTE npm** para evitar conflitos de CI/CD e garantir consistência.

## 🎯 **Objetivos da Padronização**

### **✅ Configurações Ativas:**
- ✅ **npm como único package manager** - Elimina conflitos
- ✅ **CI/CD padronizado** - Todos workflows usam npm
- ✅ **Lockfiles consistentes** - Apenas package-lock.json
- ✅ **Comandos uniformes** - npm em todos os contextos

### **❌ Package Managers Removidos:**
- ❌ **pnpm** - Removido para evitar conflitos
- ❌ **yarn** - Não é utilizado no projeto

## 📋 **Comandos Padronizados**

### **✅ Instalação:**
```bash
# ROOT
npm install

# DOCS
cd docs-astro && npm install
```

### **✅ Desenvolvimento:**
```bash
# Modo dev
npm run dev

# Build
npm run build

# Testes
npm test
npm run test:once
```

### **✅ Docs:**
```bash
cd docs-astro

# Dev
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🚀 **Vantagens da Padronização:**

### **🔧 Consistência:**
- **Um único package manager** em todo o projeto
- **CI/CD simplificado** sem conflitos
- **Lockfiles únicos** (package-lock.json)
- **Comandos padronizados** para toda a equipe

### **📊 Compatibilidade:**
- **Universal** - npm vem com Node.js
- **Estável** - Maduro e amplamente suportado
- **CI/CD friendly** - Suporte nativo em todas plataformas
- **Documentação extensa** - Padrão da comunidade

## ⚙️ **Setup para Novos Devs:**

### **1. Verificar Node.js:**
```bash
node --version
# Should be >= 18.0.0
```

### **2. Verificar npm:**
```bash
npm --version
# Should be >= 8.0.0
```

### **3. Clone e setup:**
```bash
git clone <repo>
cd open-cleaner-rn
npm install          # ROOT
cd docs-astro && npm install  # DOCS
```

## ✅ **COMANDOS PADRÃO:**

```bash
# ✅ SEMPRE USE:
npm install
npm run <script>
npm run dev
npm run build
npm run test
```

## 📝 **Adicionando Dependências:**

### **Dependência de Produção:**
```bash
# ROOT
npm install <package>

# DOCS
cd docs-astro && npm install <package>
```

### **Dependência de Desenvolvimento:**
```bash
# ROOT
npm install --save-dev <package>

# DOCS  
cd docs-astro && npm install --save-dev <package>
```

## 📊 **Estrutura de Lockfiles:**

```
projeto/
├── package-lock.json     # ROOT lockfile
└── docs-astro/
    └── package-lock.json # DOCS lockfile
```

## 🔧 **Troubleshooting:**

### **Conflitos de Cache:**
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### **Problemas de Sincronização:**
```bash
# Docs out of sync
cd docs-astro
rm -rf node_modules package-lock.json
npm install
```

## 🎉 **Benefícios Alcançados:**

- 🔄 **CI/CD sem conflitos**
- 🛠️ **Setup simplificado**
- 📦 **Compatibilidade universal**
- 🎯 **Comandos consistentes**
- 📚 **Documentação padrão**
- 🚀 **Deploy confiável**

---

> **Lembre-se:** npm é a escolha padrão para máxima compatibilidade e simplicidade! 📦 