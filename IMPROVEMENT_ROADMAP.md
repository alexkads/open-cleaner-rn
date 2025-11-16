# 🚀 Open Cleaner RN - Roadmap de Melhorias

> **Última Atualização:** 16 de novembro de 2025  
> **Versão Atual:** 0.1.0  
> **Status:** Em Desenvolvimento Ativo

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Melhorias Prioritárias](#melhorias-prioritárias)
3. [Roadmap de Implementação](#roadmap-de-implementação)
4. [Bugs Conhecidos](#bugs-conhecidos)
5. [Arquitetura Futura](#arquitetura-futura)
6. [Como Contribuir](#como-contribuir)

---

## 🎯 Visão Geral

Este documento detalha as melhorias planejadas para o Open Cleaner RN, organizadas por prioridade e impacto. O objetivo é transformar a ferramenta em uma solução completa e robusta para limpeza de ambientes de desenvolvimento.

### Objetivos Principais

- ⚡ **Performance:** Reduzir tempo de scan em 60%
- 🛡️ **Segurança:** Implementar camadas de proteção contra perda de dados
- 🎨 **UX:** Melhorar experiência do usuário com feedback visual
- 🔧 **Funcionalidades:** Adicionar recursos avançados de automação
- 📊 **Análise:** Fornecer insights sobre uso de espaço em disco

---

## 🎯 Melhorias Prioritárias

### 🔴 **Alta Prioridade** (Próximas 2 Semanas)

#### 1. **Scan Paralelo** ✅
**Status:** 🟢 Concluído (16/11/2025)
**Impacto:** Alto | **Esforço:** Médio
**Issue:** [#TBD]

**Problema Anterior:**
```typescript
// ❌ Anterior: Scans sequenciais (lento)
for (const task of CLEANING_TASKS) {
  const results = await task.scanFunction()
  // Bloqueia próximo scan até terminar
}
```

**Solução Implementada:**
```typescript
// ✅ Implementado: Scans paralelos (rápido)
const scanPromises = CLEANING_TASKS.map(task =>
  task.scanFunction()
    .then(results => ({ taskId, taskName, status: 'success', results }))
    .catch(error => ({ taskId, taskName, status: 'error', error }))
)
const scanResults = await Promise.all(scanPromises)
```

**Benefícios Alcançados:**
- ⚡ Redução estimada de 50-70% no tempo total de scan
- 🔄 Melhor utilização de recursos multi-core
- 📊 Feedback mais rápido para o usuário com toasts informativos
- 🛡️ Error handling robusto com tratamento individual por task
- 📈 Métricas de performance (duração, sucessos, erros)

**Tarefas:**
- [x] Implementar Promise.all com error handling individual
- [x] Adicionar error handling individual por task
- [x] Atualizar UI com feedback visual (toasts)
- [x] Adicionar métricas de performance e duração
- [x] Testar em ambiente de desenvolvimento
- [x] Documentar implementação

**Arquivo Modificado:** `src/pages/Dashboard.tsx:391-535`

---

#### 2. **Limpeza Seletiva (Checkboxes)** ✅
**Status:** 🟢 Concluído (16/11/2025)
**Impacto:** Alto | **Esforço:** Médio
**Issue:** [#TBD]

**Funcionalidades Implementadas:**
- ✅ Checkbox em cada card de categoria (apenas em tasks "found")
- ✅ Botões "Selecionar Tudo" / "Desmarcar Tudo"
- ✅ Contador em tempo real de categorias e espaço selecionados
- ✅ Botão Clean mostra total selecionado dinamicamente
- ✅ Limpeza executa apenas tasks selecionadas
- ✅ Todas as categorias selecionadas por padrão

**Interface Implementada:**
```
┌─────────────────────────────────────────────────┐
│ 8 de 12 categorias selecionadas (2.8 GB)       │
│ [Selecionar Tudo] [Desmarcar Tudo]             │
├─────────────────────────────────────────────────┤
│ ☑ Expo Cache              │  156 MB            │
│ ☑ Metro Cache             │   89 MB            │
│ ☐ iOS Build Cache         │  2.3 GB            │
│ ☑ npm Cache               │  512 MB            │
├─────────────────────────────────────────────────┤
│ [Clean Now]                                     │
│ 8 categorias selecionadas • 2.8 GB             │
└─────────────────────────────────────────────────┘
```

**Implementação Técnica:**
```typescript
interface CleaningTask {
  // ... outros campos
  selected: boolean  // Novo campo para seleção
}

// Filtro atualizado para limpar apenas selecionadas
const cleanableTasks = tasks.filter(
  task => task.status === 'found' &&
          task.items.length > 0 &&
          task.selected  // ✅ Novo filtro
)
```

**Benefícios Alcançados:**
- 🎯 **Controle Granular:** Usuário escolhe exatamente o que limpar
- 💡 **Feedback Visual:** Contador em tempo real do total selecionado
- ⚡ **Eficiência:** Evita limpeza desnecessária de categorias específicas
- 🔒 **Segurança:** Usuário pode desmarcar categorias sensíveis
- 📊 **Transparência:** Botão Clean mostra exatamente o que será limpo

**Tarefas:**
- [x] Adicionar campo 'selected' ao tipo CleaningTask
- [x] Adicionar checkbox em cada card (apenas em tasks "found")
- [x] Implementar funções selectAllTasks e deselectAllTasks
- [x] Criar barra de controles com contador e botões
- [x] Atualizar executeClean para filtrar tasks selecionadas
- [x] Atualizar botão Clean com total selecionado
- [x] Testar fluxo completo de seleção e limpeza

**Arquivos Modificados:**
- `src/pages/Dashboard.tsx:40-52,56,266-275,573-580,1117-1157,1300-1322,1439-1473,1441-1451`

---

#### 3. **Dialog de Confirmação Antes de Limpar** ✅
**Status:** 🟢 Concluído (16/11/2025)
**Impacto:** Alto | **Esforço:** Baixo
**Issue:** [#TBD]

**Especificação Implementada:**
```typescript
interface CleanConfirmDialogProps {
  isVisible: boolean
  categories: string[]        // Categorias que serão limpas
  totalSize: number          // Espaço total a ser liberado
  fileCount: number          // Número de arquivos
  warnings: string[]         // Avisos importantes
  onConfirm: () => void
  onCancel: () => void
}
```

**UI Implementada:**
- ✅ Modal com glass-effect e animações Framer Motion
- ✅ Grid com 3 cards mostrando: Categorias, Arquivos, Espaço
- ✅ Lista de categorias selecionadas com badges
- ✅ Seção de warnings destacada em amarelo
- ✅ Aviso de ação irreversível
- ✅ Botões Cancelar e Confirmar
- ✅ Suporte a tecla ESC para fechar
- ✅ Detalhamento de warnings por categoria

**Benefícios Alcançados:**
- 🛡️ Proteção contra limpeza acidental
- 📊 Visualização clara do que será removido
- ⚠️ Avisos contextuais sobre itens críticos
- 🎨 Interface visual intuitiva e moderna
- ⌨️ Atalho de teclado (ESC) para cancelar

**Tarefas:**
- [x] Criar componente CleanConfirmationDialog
- [x] Integrar com modal customizado usando Framer Motion
- [x] Adicionar detalhamento de warnings por categoria
- [x] Adicionar animações de entrada/saída
- [x] Implementar suporte a tecla ESC
- [x] Testar fluxo completo

**Arquivos Modificados:**
- `src/components/CleanConfirmationDialog.tsx` (novo)
- `src/pages/Dashboard.tsx:22,242,383-393,994-1015,1431-1453`

---

#### 4. **Barra de Progresso Visual** ✅
**Status:** 🟢 Concluído (16/11/2025)
**Impacto:** Alto | **Esforço:** Médio
**Issue:** [#TBD]

**Funcionalidades Implementadas:**
- ✅ Progresso global (0-100%) com animação suave
- ✅ Progresso individual por categoria em tempo real
- ✅ Velocidade de processamento (MB/s) calculada dinamicamente
- ✅ Tempo estimado restante (ETA) atualizado a cada task
- ✅ Botão de cancelamento funcional
- ✅ Grid de stats (Espaço Liberado, Velocidade, ETA)
- ✅ Contador de erros em tempo real
- ✅ Efeito shimmer na barra de progresso

**Implementação Realizada:**
```typescript
interface CleaningProgressProps {
  isVisible: boolean
  currentTask: string        // Task sendo processada
  totalTasks: number         // Total de categorias
  completedTasks: number     // Categorias concluídas
  totalSpaceCleaned: number  // Bytes já liberados
  totalSpaceToClean: number  // Bytes totais
  speedMBps: number          // Velocidade em MB/s
  etaSeconds: number         // Tempo restante em segundos
  errors: number             // Erros encontrados
  onCancel?: () => void      // Handler de cancelamento
}
```

**Cálculo de Velocidade e ETA:**
```typescript
const elapsedSeconds = (Date.now() - startTime) / 1000
const speedMBps = elapsedSeconds > 0
  ? totalSpaceCleaned / (1024 * 1024) / elapsedSeconds
  : 0
const etaSeconds = speedMBps > 0 && remainingTasks > 0
  ? ((totalSpaceToClean - totalSpaceCleaned) / (1024 * 1024)) / speedMBps
  : 0
```

**Benefícios Alcançados:**
- 📊 **Feedback Visual:** Usuário vê progresso em tempo real
- ⚡ **Métricas Precisas:** Velocidade e ETA calculados dinamicamente
- 🎯 **Cancelamento:** Usuário pode interromper a limpeza
- 🎨 **UX Aprimorada:** Animações suaves e design moderno
- 📈 **Transparência:** Informações detalhadas sobre o processo

**Tarefas:**
- [x] Criar componente CleaningProgress reutilizável
- [x] Implementar cálculo de velocidade (MB/s)
- [x] Implementar cálculo de ETA
- [x] Adicionar suporte a cancelamento
- [x] Integrar com Dashboard
- [x] Adicionar animações suaves (Framer Motion)
- [x] Adicionar grid de stats visuais
- [x] Adicionar efeito shimmer na barra
- [x] Testar em ambiente de desenvolvimento

**Arquivos Modificados:**
- `src/components/CleaningProgress.tsx` (novo)
- `src/pages/Dashboard.tsx:23,244-253,640-663,731-762,880-902,970-1001,1389-1416`

---

#### 5. **React Error Boundaries**
**Status:** 🔴 Não Iniciado  
**Impacto:** Alto | **Esforço:** Baixo  
**Issue:** [#TBD]

**Implementação:**
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
    // Enviar para serviço de monitoramento
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

**Tarefas:**
- [ ] Criar ErrorBoundary component
- [ ] Criar ErrorFallback UI elegante
- [ ] Adicionar logging de erros
- [ ] Wrap componentes críticos
- [ ] Adicionar botão de reset/retry

---

### 🟡 **Média Prioridade** (Próximas 4 Semanas)

#### 6. **Dry Run Mode (Visualização Sem Deletar)**
**Status:** 🟡 Planejado  
**Impacto:** Médio | **Esforço:** Baixo

**Funcionalidade:**
- Preview completo do que será removido
- Organizado por categoria
- Opção de exportar lista
- Conversão fácil para limpeza real

**Tarefas:**
- [ ] Adicionar toggle "Dry Run Mode"
- [ ] Criar UI de preview detalhado
- [ ] Implementar exportação de lista
- [ ] Adicionar testes E2E

---

#### 7. **Notificações Desktop**
**Status:** 🟡 Planejado  
**Impacto:** Médio | **Esforço:** Baixo

**Casos de Uso:**
```typescript
// Scan completo
notification.send({
  title: "Scan Concluído",
  body: "4.2 GB encontrados em 12 categorias",
  icon: "success"
})

// Limpeza concluída
notification.send({
  title: "Limpeza Concluída",
  body: "3.8 GB liberados com sucesso",
  icon: "success"
})
```

**Tarefas:**
- [ ] Integrar Tauri notification API
- [ ] Criar sistema de notificações
- [ ] Adicionar configurações de preferências
- [ ] Testar em todas as plataformas

---

#### 8. **Temas Claro/Escuro**
**Status:** 🟡 Planejado  
**Impacto:** Médio | **Esforço:** Médio

**Implementação:**
- Usar CSS variables para cores
- Persistir preferência do usuário
- Sincronizar com tema do sistema
- Transições suaves entre temas

**Tarefas:**
- [ ] Criar sistema de temas com CSS vars
- [ ] Implementar toggle de tema
- [ ] Adicionar detecção de tema do sistema
- [ ] Atualizar todos os componentes
- [ ] Adicionar preview de temas

---

#### 9. **Exportar Relatórios (CSV/JSON)**
**Status:** 🟡 Planejado  
**Impacto:** Médio | **Esforço:** Baixo

**Formatos Suportados:**

**CSV:**
```csv
Data,Hora,Categoria,Espaço Liberado,Arquivos,Duração,Status
2025-11-16,14:30:25,Quick Clean,4.2 GB,1847,45s,success
```

**JSON:**
```json
{
  "date": "2025-11-16",
  "time": "14:30:25",
  "categories": ["Expo Cache", "Metro Cache"],
  "spaceFreed": 4512345678,
  "filesDeleted": 1847,
  "duration": 45000,
  "status": "success"
}
```

**Tarefas:**
- [ ] Implementar exportação CSV
- [ ] Implementar exportação JSON
- [ ] Adicionar botão de export no History
- [ ] Usar Tauri File Dialog para salvar
- [ ] Adicionar filtros de período

---

#### 10. **Atalhos de Teclado**
**Status:** 🟡 Planejado  
**Impacto:** Baixo | **Esforço:** Baixo

**Atalhos Propostos:**
```
Ctrl/Cmd + S  → Iniciar Scan
Ctrl/Cmd + C  → Limpar (se scan completo)
Ctrl/Cmd + R  → Recarregar/Reset
Ctrl/Cmd + H  → Abrir Histórico
Ctrl/Cmd + ,  → Abrir Configurações
Ctrl/Cmd + D  → Toggle Debug Panel
Esc           → Cancelar operação
```

**Tarefas:**
- [ ] Implementar hook useKeyboardShortcuts
- [ ] Adicionar visual hints dos atalhos
- [ ] Criar página de referência de atalhos
- [ ] Permitir customização
- [ ] Testar cross-platform

---

### 🟢 **Baixa Prioridade** (Futuro)

#### 11. **Scan Agendado**
**Status:** 🟢 Futuro  
**Impacto:** Médio | **Esforço:** Alto

**Requisitos:**
- Configurar frequência (diária, semanal, mensal)
- Horário específico
- Limpeza automática opcional
- Notificações de resultado

---

#### 12. **Backup Antes de Limpar**
**Status:** 🟢 Futuro  
**Impacto:** Alto | **Esforço:** Alto

**Especificação:**
- Mover arquivos para pasta temporária
- Manter por X dias configurável
- Restauração com um clique
- Limpeza automática de backups antigos

---

#### 13. **Sistema de Plugins**
**Status:** 🟢 Futuro  
**Impacto:** Alto | **Esforço:** Muito Alto

**Arquitetura:**
```typescript
interface CleanerPlugin {
  id: string
  name: string
  version: string
  author: string
  
  register(api: PluginAPI): void
  scan(): Promise<ScanResult[]>
  clean(paths: string[]): Promise<CleaningResult>
}
```

---

#### 14. **Cloud Sync de Configurações**
**Status:** 🟢 Futuro  
**Impacto:** Baixo | **Esforço:** Alto

**Recursos:**
- Sincronizar preferências
- Histórico compartilhado
- Configurações de categorias
- Integração com contas (GitHub, Google)

---

#### 15. **API REST**
**Status:** 🟢 Futuro  
**Impacto:** Médio | **Esforço:** Alto

**Endpoints:**
```
GET  /api/scan          # Iniciar scan
GET  /api/scan/:id      # Status do scan
POST /api/clean         # Iniciar limpeza
GET  /api/history       # Histórico
GET  /api/stats         # Estatísticas
```

---

## 📅 Roadmap de Implementação

### **Sprint 1: Performance & UX Core** (2 semanas)
```
✅ Semana 1:
  - [ ] Scan paralelo
  - [ ] Limpeza seletiva (UI)
  - [ ] Dialog de confirmação

✅ Semana 2:
  - [ ] Barra de progresso
  - [ ] Error boundaries
  - [ ] Testes unitários
```

### **Sprint 2: Funcionalidades Essenciais** (2 semanas)
```
✅ Semana 3:
  - [ ] Dry run mode
  - [ ] Notificações desktop
  - [ ] Atalhos de teclado

✅ Semana 4:
  - [ ] Exportar relatórios
  - [ ] Temas claro/escuro
  - [ ] Documentação atualizada
```

### **Sprint 3: Recursos Avançados** (4 semanas)
```
✅ Semanas 5-6:
  - [ ] Cache de resultados
  - [ ] Lista de exclusão
  - [ ] Retry logic
  - [ ] Tutorial inicial

✅ Semanas 7-8:
  - [ ] Categorias adicionais
  - [ ] Melhorias no Docker
  - [ ] Dashboard de métricas
  - [ ] Testes E2E
```

---

## 🐛 Bugs Conhecidos

### **🟢 Bugs Corrigidos**

#### Bug #1: Notificações Toast Duplicadas (Sonner) ✅
**Status:** 🟢 Corrigido (16/11/2025)
**Impacto:** Médio - UX prejudicada com múltiplas notificações para mesma ação

**Descrição:** Após a conclusão da limpeza, eram exibidas notificações toast duplicadas quando havia erros ou avisos:
1. Toast principal de conclusão
2. Toast adicional com detalhes de erro/aviso (1 segundo depois)

**Causa Raiz:**
```typescript
// ❌ Problema: setTimeout criando toasts adicionais
toast[toastType](toastTitle, { description: toastDescription })

// Toast duplicado aparecia 1s depois
if (hasErrors) {
  setTimeout(() => {
    toast.error('Alguns erros ocorreram...') // DUPLICADO!
  }, 1000)
}
```

**Solução Implementada:**
```typescript
// ✅ Solução: Incluir detalhes na descrição do toast principal
let toastDescription = `${formatBytes(totalSpaceCleaned)} liberados...`
if (hasErrors) {
  toastDescription += `\n${errors.length} erro(s) encontrado(s)...`
}

toast[toastType](toastTitle, { description: toastDescription })
// Nenhum toast adicional necessário
```

**Benefícios:**
- 🎯 UX mais limpa - uma notificação por ação
- 📊 Informações consolidadas em um único toast
- ⚡ Feedback mais direto sem delays desnecessários

**Arquivos Modificados:**
- `src/pages/Dashboard.tsx:790-811` (primeiro bloco de limpeza)
- `src/pages/Dashboard.tsx:1020-1041` (segundo bloco de limpeza)

---

### **🔴 Críticos**

#### Bug #2: Race Condition no handleClean
**Descrição:** Múltiplas chamadas de `handleClean` podem causar estado inconsistente

**Reprodução:**
```typescript
// Clicar rapidamente no botão Clean múltiplas vezes
handleClean() // Chamada 1
handleClean() // Chamada 2 (não deveria executar)
```

**Solução:**
```typescript
const cleanMutex = useRef(false)

const handleClean = useCallback(async () => {
  if (cleanMutex.current) return // Prevenir execução paralela
  cleanMutex.current = true
  
  try {
    // ... lógica de limpeza
  } finally {
    cleanMutex.current = false
  }
}, [])
```

**Status:** 🔴 Não Corrigido  
**Prioridade:** Alta

---

#### Bug #2: Memory Leak nos Event Listeners
**Descrição:** Event listeners do Debug Panel podem não ser removidos

**Local:** `src/pages/Dashboard.tsx:280`

**Solução:**
```typescript
useEffect(() => {
  const handleDebugLogTasks = () => { /* ... */ }
  
  window.addEventListener('debug-log-tasks', handleDebugLogTasks)
  
  return () => {
    window.removeEventListener('debug-log-tasks', handleDebugLogTasks)
  }
}, [tasks, isScanning, isCleaning, totalSpaceFound]) // Dependências corretas
```

**Status:** 🔴 Não Corrigido  
**Prioridade:** Média

---

#### Bug #3: Tasks Ficam em Estado "Scanning" Após Erro
**Descrição:** Se scan falhar, task pode ficar permanentemente em "scanning"

**Solução:**
```typescript
try {
  updateTaskStatus(task.id, { status: 'scanning' })
  const results = await task.scanFunction()
  updateTaskStatus(task.id, { status: 'found', items: results })
} catch (error) {
  updateTaskStatus(task.id, { status: 'error' }) // Importante!
  console.error(error)
}
```

**Status:** 🟡 Parcialmente Corrigido  
**Prioridade:** Média

---

### **🟡 Moderados**

#### Bug #4: Parse de Tamanho Docker Pode Falhar
**Descrição:** `parse_docker_size` não trata todos os formatos possíveis

**Exemplo de Falha:**
```
Input: "123.45kB"  → ✅ OK
Input: "1.2GB"     → ✅ OK
Input: "789 MB"    → ❌ Falha (espaço extra)
Input: "N/A"       → ❌ Falha
```

**Solução:**
```rust
fn parse_docker_size(size_str: &str) -> Result<u64, String> {
    let cleaned = size_str.trim().to_uppercase();
    
    // Tratar casos especiais
    if cleaned == "N/A" || cleaned == "0B" {
        return Ok(0);
    }
    
    // Parse com regex mais robusto
    // ... implementação melhorada
}
```

**Status:** 🟡 Não Corrigido  
**Prioridade:** Baixa

---

## 🏗️ Arquitetura Futura

### **Estado Global com Zustand**

```typescript
// src/store/cleanerStore.ts
interface CleanerState {
  // Estado
  tasks: CleaningTask[]
  isScanning: boolean
  isCleaning: boolean
  selectedTasks: Set<string>
  
  // Ações
  setTasks: (tasks: CleaningTask[]) => void
  toggleTaskSelection: (taskId: string) => void
  startScan: () => Promise<void>
  startClean: () => Promise<void>
  
  // Computed
  totalSpaceSelected: number
  totalFilesSelected: number
}

const useCleanerStore = create<CleanerState>((set, get) => ({
  // ... implementação
}))
```

### **Sistema de Queue para Operações**

```typescript
class CleaningQueue {
  private queue: CleaningOperation[] = []
  private running = false
  
  enqueue(operation: CleaningOperation) {
    this.queue.push(operation)
    this.process()
  }
  
  private async process() {
    if (this.running) return
    this.running = true
    
    while (this.queue.length > 0) {
      const operation = this.queue.shift()!
      await operation.execute()
    }
    
    this.running = false
  }
}
```

---

## 🧪 Estratégia de Testes

### **Cobertura Desejada**

```
┌─────────────────────┬─────────┬─────────┐
│ Tipo                │ Atual   │ Meta    │
├─────────────────────┼─────────┼─────────┤
│ Unit Tests          │   15%   │   80%   │
│ Integration Tests   │    0%   │   60%   │
│ E2E Tests          │    0%   │   40%   │
│ Overall Coverage    │   12%   │   70%   │
└─────────────────────┴─────────┴─────────┘
```

### **Testes Prioritários**

**Unit Tests:**
```typescript
describe('TauriService', () => {
  it('should scan expo cache', async () => {
    const results = await TauriService.scanExpoCache()
    expect(results).toBeInstanceOf(Array)
  })
  
  it('should handle scan errors gracefully', async () => {
    mockInvoke.mockRejectedValue(new Error('Scan failed'))
    await expect(TauriService.scanExpoCache()).rejects.toThrow()
  })
})
```

**Integration Tests:**
```typescript
describe('Scan & Clean Flow', () => {
  it('should complete full scan and clean cycle', async () => {
    // 1. Scan
    await user.click(screen.getByText('Quick Scan'))
    await waitFor(() => expect(screen.getByText(/Found:/)).toBeInTheDocument())
    
    // 2. Clean
    await user.click(screen.getByText('Clean Now'))
    await waitFor(() => expect(screen.getByText(/Cleaning Completed/)).toBeInTheDocument())
  })
})
```

---

## 📊 Métricas de Sucesso

### **KPIs Técnicos**

| Métrica | Atual | Meta Q1 2026 |
|---------|-------|--------------|
| Tempo de Scan | 15-20s | < 5s |
| Tempo de Clean | 30-45s | < 15s |
| Cobertura de Testes | 12% | 70% |
| Bundle Size | 2.5 MB | < 2 MB |
| Tempo de Inicialização | 1.2s | < 0.8s |

### **KPIs de Produto**

| Métrica | Atual | Meta Q1 2026 |
|---------|-------|--------------|
| Taxa de Sucesso de Limpeza | ~85% | > 95% |
| Usuários Ativos Mensais | - | 1000+ |
| Rating Médio | - | 4.5+ ⭐ |
| Tempo Médio de Sessão | ~2min | ~5min |

---

## 🤝 Como Contribuir

### **Escolhendo uma Task**

1. Verifique issues abertas em: [GitHub Issues](https://github.com/alexkads/open-cleaner-rn/issues)
2. Procure por labels: `good-first-issue`, `help-wanted`, `enhancement`
3. Comente na issue para ser atribuído
4. Fork o repositório e crie uma branch

### **Implementando**

```bash
# 1. Clone e configure
git clone https://github.com/alexkads/open-cleaner-rn.git
cd open-cleaner-rn
npm install

# 2. Crie uma branch
git checkout -b feature/scan-paralelo

# 3. Desenvolva e teste
npm run test
npm run lint
npm run type-check

# 4. Commit e push
git commit -m "feat: implementa scan paralelo"
git push origin feature/scan-paralelo

# 5. Abra um Pull Request
```

### **Padrões de Código**

- ✅ Seguir Conventional Commits
- ✅ Testes para novas funcionalidades
- ✅ Documentação atualizada
- ✅ TypeScript strict mode
- ✅ ESLint e Prettier passando

---

## 📚 Recursos Adicionais

### **Documentação Relacionada**

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição
- [TESTING.md](./TESTING.md) - Estratégia de testes
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Arquitetura do sistema
- [API.md](./docs/API.md) - Documentação de API

### **Links Úteis**

- [GitHub Project Board](https://github.com/alexkads/open-cleaner-rn/projects)
- [Discord Community](https://discord.gg/open-cleaner-rn)
- [Documentation Site](https://alexkads.github.io/open-cleaner-rn/)

---

## 📝 Changelog de Melhorias

### **v0.2.0 (Planejado - Janeiro 2026)**
- ✅ Scan paralelo
- ✅ Limpeza seletiva
- ✅ Dialog de confirmação
- ✅ Barra de progresso
- ✅ Error boundaries

### **v0.3.0 (Planejado - Fevereiro 2026)**
- ✅ Dry run mode
- ✅ Notificações desktop
- ✅ Temas claro/escuro
- ✅ Exportar relatórios
- ✅ Atalhos de teclado

### **v0.4.0 (Planejado - Março 2026)**
- ✅ Scan agendado
- ✅ Sistema de backup
- ✅ Lista de exclusão
- ✅ Tutorial inicial

---

## 🎯 Meta Final

Transformar o **Open Cleaner RN** na **ferramenta #1 de limpeza** para desenvolvedores React Native, com:

- 🚀 **Performance incomparável**
- 🛡️ **Segurança absoluta**
- 🎨 **UX excepcional**
- 🔧 **Funcionalidades avançadas**
- 🌍 **Comunidade ativa**

---

**Última revisão:** 16 de novembro de 2025  
**Próxima revisão:** 01 de dezembro de 2025  

Para sugestões ou dúvidas sobre este roadmap, abra uma issue em:  
https://github.com/alexkads/open-cleaner-rn/issues
