# 🚨 Troubleshooting - "No items found to clean"

## ❌ Problema
Mensagem: "No items found to clean. Please scan first." mesmo após fazer scan com sucesso.

## 🔧 Debug Steps Implementados

### 1. **Logs Detalhados Adicionados**
- ✅ Console logs no `handleClean()` 
- ✅ Debug detalhado de todas as tasks
- ✅ Status de cada task individual
- ✅ Contagem de items por task

### 2. **Debug Panel Melhorado**
- ✅ Botão roxo no canto inferior direito
- ✅ "Task Status Details" seção
- ✅ Botão "Log Task Details to Console"
- ✅ Event listener para debug

### 3. **Mensagem de Erro Melhorada**
A mensagem agora mostra exatamente qual condição está falhando:
- "No tasks loaded" - Tasks não carregaram
- "No tasks have items" - Scan não encontrou arquivos  
- "Tasks found but wrong status" - Status incorreto (mostra todos os status)

## 🧪 Como Debuggar

### **Passo 1: Fazer Scan**
1. Clique em "Quick Scan"
2. Aguarde completar (~6-8 segundos)
3. Verifique se aparece espaço encontrado

### **Passo 2: Verificar Console**
```javascript
// Logs automáticos após scan
=== TASK DEBUG ===
Total tasks: 9
Tasks detail: [{id: "expo-cache", status: "found", itemsLength: 2, ...}, ...]
```

### **Passo 3: Tentar Limpeza**
1. Clique em "Clean Now"
2. Verifique logs no console:
```javascript
=== DEBUG CLEAN ===
Total tasks: 9
Cleanable tasks: 7  // Deve ser > 0
```

### **Passo 4: Debug Panel**
1. Clique no botão **roxo** (debug)
2. Na seção "Task Status Details":
   - Total Tasks: deve ser 9
   - Cleanable: deve ser > 0
3. Clique em "Log Task Details to Console"

## 🔍 Possíveis Causas e Soluções

### **A. Status das Tasks Errado**
```javascript
// Esperado após scan
status: "found"  // ✅ Correto
status: "completed"  // ❌ Problema: não tem items para limpar
status: "error"  // ❌ Problema: scan falhou
```

**Solução:** Verificar MockTauriService retornando dados

### **B. Items Array Vazio**
```javascript
// Esperado após scan
items: [{path: "/path/to/cache", size: 1024, ...}]  // ✅ Correto
items: []  // ❌ Problema: scan não retornou dados
```

**Solução:** Verificar funções scan retornando mock data

### **C. Filtro de Limpeza Falhando**
```javascript
const cleanableTasks = tasks.filter(task => 
  task.status === 'found' && task.items.length > 0
);
```

**Verificar:**
- `task.status === 'found'` ✅
- `task.items.length > 0` ✅

## 🎯 Quick Fix

Se o problema persistir, adicione este debug temporário:

```javascript
// No handleClean, antes do filtro
console.log('DEBUG TASKS:', tasks.map(t => ({
  name: t.name,
  status: t.status,
  hasItems: t.items.length > 0,
  wouldBeCleanable: t.status === 'found' && t.items.length > 0
})));
```

## 🏆 Teste de Funcionalidade Esperado

Com MockTauriService funcionando corretamente:

1. ✅ **Scan encontra 9 tasks**
2. ✅ **7+ tasks ficam com status "found"** 
3. ✅ **Cada task tem items.length > 0**
4. ✅ **cleanableTasks.length >= 7**
5. ✅ **Botão "Clean Now" funciona**

---

## ✅ Resultado Esperado

Console após scan bem-sucedido:
```
=== DEBUG CLEAN ===
Total tasks: 9
Cleanable tasks: 7
Cleaning expo-cache: 2 files
Cleaning metro-cache: 2 files
...
Clean completed: {totalSpaceCleaned: 915MB, totalFilesDeleted: 14, ...}
```

**💡 Se ainda não funcionar:** O problema está na implementação do MockTauriService ou na lógica de estado das tasks. 