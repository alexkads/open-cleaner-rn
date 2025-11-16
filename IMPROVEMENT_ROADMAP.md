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

#### 1. **Scan Paralelo** 
**Status:** 🔴 Não Iniciado  
**Impacto:** Alto | **Esforço:** Médio  
**Issue:** [#TBD]

**Problema Atual:**
```typescript
// ❌ Atual: Scans sequenciais (lento)
for (const task of CLEANING_TASKS) {
  const results = await task.scanFunction()
  // Bloqueia próximo scan até terminar
}
```

**Solução Proposta:**
```typescript
// ✅ Proposto: Scans paralelos (rápido)
const scanPromises = CLEANING_TASKS.map(task => 
  task.scanFunction().catch(err => {
    console.error(`Scan failed for ${task.name}:`, err)
    return []
  })
)
const allResults = await Promise.allSettled(scanPromises)
```

**Benefícios:**
- ⚡ Redução de 50-70% no tempo total de scan
- 🔄 Melhor utilização de recursos multi-core
- 📊 Feedback mais rápido para o usuário

**Tarefas:**
- [ ] Implementar Promise.allSettled para scans
- [ ] Adicionar error handling individual por task
- [ ] Atualizar UI para mostrar progresso paralelo
- [ ] Testar em diferentes plataformas
- [ ] Documentar nova arquitetura

---

#### 2. **Limpeza Seletiva (Checkboxes)**
**Status:** 🔴 Não Iniciado  
**Impacto:** Alto | **Esforço:** Médio  
**Issue:** [#TBD]

**Requisitos:**
- Checkbox em cada card de categoria
- "Selecionar Tudo" / "Desmarcar Tudo"
- Mostrar total selecionado em tempo real
- Salvar preferências do usuário

**Mockup:**
```
┌─────────────────────────────────────┐
│ ☑ Expo Cache          │  156 MB    │
│ ☑ Metro Cache         │   89 MB    │
│ ☐ iOS Build Cache     │  2.3 GB    │
│ ☑ npm Cache           │  512 MB    │
├─────────────────────────────────────┤
│ [☑ Selecionar Tudo] Total: 757 MB  │
│ [🗑️ Limpar Selecionados]           │
└─────────────────────────────────────┘
```

**Tarefas:**
- [ ] Adicionar estado de seleção em cada CleaningTask
- [ ] Criar componentes de checkbox reutilizáveis
- [ ] Implementar lógica de seleção múltipla
- [ ] Persistir preferências no localStorage
- [ ] Atualizar handleClean para usar seleção
- [ ] Adicionar testes unitários

---

#### 3. **Dialog de Confirmação Antes de Limpar**
**Status:** 🔴 Não Iniciado  
**Impacto:** Alto | **Esforço:** Baixo  
**Issue:** [#TBD]

**Especificação:**
```typescript
interface CleanConfirmDialog {
  categories: string[]        // Categorias que serão limpas
  totalSize: number          // Espaço total a ser liberado
  fileCount: number          // Número de arquivos
  warnings: string[]         // Avisos importantes
  onConfirm: () => void
  onCancel: () => void
}
```

**UI Design:**
```
╔════════════════════════════════════════╗
║  ⚠️  Confirmar Limpeza                 ║
╟────────────────────────────────────────╢
║  Você está prestes a limpar:           ║
║                                        ║
║  📦 12 categorias                      ║
║  🗑️  1,847 arquivos                    ║
║  💾 4.2 GB de espaço                   ║
║                                        ║
║  ⚠️ Avisos:                            ║
║  • iOS Backups serão removidos         ║
║  • Esta ação não pode ser desfeita     ║
║                                        ║
║  [ Cancelar ]  [ ✓ Confirmar ]        ║
╚════════════════════════════════════════╝
```

**Tarefas:**
- [ ] Criar componente CleanConfirmationDialog
- [ ] Integrar com Sonner ou criar modal customizado
- [ ] Adicionar detalhamento de warnings
- [ ] Implementar "Não mostrar novamente" (opcional)
- [ ] Adicionar animações de transição

---

#### 4. **Barra de Progresso Visual**
**Status:** 🔴 Não Iniciado  
**Impacto:** Alto | **Esforço:** Médio  
**Issue:** [#TBD]

**Funcionalidades:**
- Progresso global (0-100%)
- Progresso individual por categoria
- Velocidade de processamento (MB/s)
- Tempo estimado restante (ETA)
- Cancelamento de operação

**Exemplo de Implementação:**
```typescript
interface ProgressState {
  current: number        // Itens processados
  total: number         // Total de itens
  percentage: number    // 0-100
  speed: number         // MB/s
  eta: number          // Segundos restantes
  currentTask: string  // Nome da task atual
}
```

**Componente Visual:**
```tsx
<ProgressBar
  percentage={75}
  label="Limpando Metro Cache..."
  speed="12.5 MB/s"
  eta="23s restantes"
  onCancel={handleCancel}
/>
```

**Tarefas:**
- [ ] Criar componente ProgressBar reutilizável
- [ ] Implementar cálculo de velocidade e ETA
- [ ] Adicionar suporte a cancelamento
- [ ] Integrar com Dashboard
- [ ] Adicionar animações suaves

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

### **🔴 Críticos**

#### Bug #1: Race Condition no handleClean
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
