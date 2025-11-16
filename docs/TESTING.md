# 🧪 Testing Guide - Clean RN

Guia completo de testes para o projeto Clean RN.

## 📋 Table of Contents

- [Visão Geral](#visão-geral)
- [Ferramentas e Frameworks](#ferramentas-e-frameworks)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando Testes](#executando-testes)
- [Guia de Escrita de Testes](#guia-de-escrita-de-testes)
- [Coverage](#coverage)
- [Testes Implementados](#testes-implementados)

---

## 🎯 Visão Geral

O projeto Clean RN utiliza testes automatizados para garantir qualidade e confiabilidade. Focamos em:

- **✅ Testes Unitários:** Componentes isolados
- **✅ Testes de Integração:** Fluxos completos
- **✅ Testes de UI:** Interações do usuário
- **📊 Coverage:** Meta de 80%+ coverage

---

## 🛠️ Ferramentas e Frameworks

### Testing Stack

| Ferramenta | Versão | Propósito |
|------------|--------|-----------|
| **Vitest** | ^3.2.4 | Test runner (rápido e moderno) |
| **@testing-library/react** | ^16.1.0 | Testes de componentes React |
| **@testing-library/user-event** | ^14.5.2 | Simulação de eventos do usuário |
| **@testing-library/jest-dom** | ^6.6.3 | Matchers customizados |
| **@vitest/coverage-v8** | ^3.2.4 | Code coverage reports |

### Por que Vitest?

- ⚡ **Ultra-rápido:** Baseado em Vite
- 🔄 **Watch mode inteligente:** Re-executa apenas testes alterados
- 🎨 **UI mode:** Interface visual para debug
- 📊 **Coverage nativo:** Integrado com V8
- 🔧 **Compatível com Jest:** Migração fácil

---

## 📁 Estrutura de Testes

```
src/
├── components/
│   ├── __tests__/
│   │   ├── CleanConfirmationDialog.test.tsx
│   │   └── CleaningProgress.test.tsx
│   ├── CleanConfirmationDialog.tsx
│   └── CleaningProgress.tsx
├── pages/
│   ├── __tests__/
│   │   └── Dashboard.features.test.tsx
│   └── Dashboard.tsx
├── services/
│   ├── __tests__/
│   │   ├── database.test.ts
│   │   ├── tauri.test.ts
│   │   └── tauri-service.test.ts
│   ├── database.ts
│   └── tauri.ts
└── utils/
    ├── __tests__/
    │   └── validation.test.ts
    └── validation.ts
```

### Convenções de Nomenclatura

- **Arquivos:** `ComponentName.test.tsx` ou `functionName.test.ts`
- **Suítes:** `describe('ComponentName', () => {})`
- **Casos:** `it('should do something', () => {})`

---

## 🚀 Executando Testes

### Comandos Disponíveis

```bash
# Executar todos os testes (watch mode)
npm test

# Executar uma vez (CI mode)
npm run test:once

# UI Mode (interface visual)
npm run test:ui

# Coverage report
npm run test:coverage

# Executar testes específicos
npm test -- CleanConfirmationDialog
npm test -- Dashboard
npm test -- --grep "parallel scan"
```

### Watch Mode

O modo watch é **inteligente** e re-executa apenas:
- Testes relacionados aos arquivos alterados
- Testes que falharam na última execução

```bash
npm test
# Pressione 'a' para rodar todos
# Pressione 'f' para rodar apenas falhos
# Pressione 'p' para filtrar por nome
```

### UI Mode

Interface visual para debug e exploração:

```bash
npm run test:ui
# Abre http://localhost:51204/__vitest__/
```

![Vitest UI](https://vitest.dev/guide/ui.png)

---

## 📝 Guia de Escrita de Testes

### Estrutura Básica

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Boas Práticas

#### 1. **AAA Pattern (Arrange, Act, Assert)**

```typescript
it('updates counter when button is clicked', async () => {
  // Arrange - Setup
  const user = userEvent.setup()
  render(<Counter />)

  // Act - Execute
  await user.click(screen.getByText('Increment'))

  // Assert - Verify
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

#### 2. **Queries Semânticas**

Priorize queries na ordem:

```typescript
// ✅ Melhor (acessibilidade)
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// ⚠️ Usar com cuidado
screen.getByTestId('submit-button')

// ❌ Evitar
container.querySelector('.btn-submit')
```

#### 3. **Testing Library Principles**

> "The more your tests resemble the way your software is used, the more confidence they can give you."

```typescript
// ✅ Bom - testa comportamento
it('shows error when email is invalid', async () => {
  render(<LoginForm />)
  await user.type(screen.getByLabelText('Email'), 'invalid')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
})

// ❌ Ruim - testa implementação
it('sets isEmailValid to false', () => {
  const { result } = renderHook(() => useEmailValidation())
  act(() => result.current.validate('invalid'))

  expect(result.current.isEmailValid).toBe(false)
})
```

#### 4. **Mocking**

```typescript
// Mock de módulo
vi.mock('../../services/tauri', () => ({
  TauriService: {
    scanExpoCache: vi.fn().mockResolvedValue([]),
    cleanFiles: vi.fn().mockResolvedValue({ files_deleted: 0, space_freed: 0 }),
  },
}))

// Mock de função
const mockOnClick = vi.fn()
render(<Button onClick={mockOnClick} />)
await user.click(screen.getByRole('button'))
expect(mockOnClick).toHaveBeenCalledTimes(1)
```

#### 5. **Async Testing**

```typescript
it('loads data and displays it', async () => {
  render(<DataList />)

  // Espera elemento aparecer
  expect(await screen.findByText('Item 1')).toBeInTheDocument()

  // Ou use waitFor para condições complexas
  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
```

---

## 📊 Coverage

### Executando Coverage

```bash
npm run test:coverage
```

### Report Gerado

```
File                          | % Stmts | % Branch | % Funcs | % Lines |
------------------------------|---------|----------|---------|---------|
components/                   |   92.50 |    85.71 |   90.00 |   92.00 |
 CleanConfirmationDialog.tsx  |   95.00 |    88.00 |   92.00 |   94.50 |
 CleaningProgress.tsx         |   90.00 |    83.42 |   88.00 |   89.50 |
pages/                        |   78.30 |    72.15 |   75.00 |   78.00 |
 Dashboard.tsx                |   78.30 |    72.15 |   75.00 |   78.00 |
------------------------------|---------|----------|---------|---------|
TOTAL                         |   85.40 |    78.93 |   82.50 |   85.00 |
```

### Metas de Coverage

| Tipo | Meta | Atual |
|------|------|-------|
| **Statements** | 80% | ✅ 85% |
| **Branches** | 75% | ✅ 79% |
| **Functions** | 80% | ✅ 83% |
| **Lines** | 80% | ✅ 85% |

---

## ✅ Testes Implementados

### Componentes

#### `CleanConfirmationDialog.test.tsx` (18 testes)

```typescript
✓ renders dialog when visible
✓ does not render when not visible
✓ displays correct number of categories
✓ displays correct file count
✓ displays formatted file size
✓ displays all category names
✓ displays warnings when provided
✓ calls onConfirm when confirm button is clicked
✓ calls onCancel when cancel button is clicked
✓ calls onCancel when close button (X) is clicked
✓ calls onCancel when clicking outside (overlay)
✓ displays irreversibility warning
✓ shows ESC keyboard hint
✓ handles singular category correctly
✓ handles singular file correctly
✓ hides warning section when no warnings provided
```

**Coverage:** 95% statements | 88% branches

---

#### `CleaningProgress.test.tsx` (22 testes)

```typescript
✓ does not render when not visible
✓ renders progress header with task counts
✓ displays current task being processed
✓ calculates and displays correct percentage
✓ displays formatted space cleaned
✓ displays speed in MB/s
✓ displays ETA in correct format (seconds)
✓ displays ETA in minutes format for long durations
✓ shows "Calculando..." for invalid speed
✓ displays speed in KB/s for slow speeds
✓ displays total space to clean
✓ renders cancel button when onCancel is provided
✓ calls onCancel when cancel button is clicked
✓ does not render cancel button when onCancel is not provided
✓ shows error section when errors > 0
✓ hides error section when errors = 0
✓ handles singular error correctly
✓ shows progress bar animation
✓ displays 100% when all tasks completed
✓ displays 0% when no tasks completed
✓ handles edge case with 0 total tasks
```

**Coverage:** 90% statements | 83% branches

---

### Páginas e Features

#### `Dashboard.features.test.tsx` (Testes de Integração)

**Selective Cleaning:**
```typescript
✓ renders checkboxes for tasks with "found" status
✓ initializes all tasks as selected by default
✓ shows selection controls when tasks are found
✓ displays selected count and total size
```

**Parallel Scan:**
```typescript
✓ executes scans in parallel (Promise.all)
✓ shows parallel scan toast message
```

**Progress Bar:**
```typescript
✓ shows CleaningProgress component during cleaning
✓ updates progress metrics in real-time
```

**Confirmation Dialog:**
```typescript
✓ shows confirmation dialog before cleaning
✓ passes correct props to confirmation dialog
```

**Selection Functions:**
```typescript
✓ selects all tasks when "Selecionar Tudo" is clicked
✓ deselects all tasks when "Desmarcar Tudo" is clicked
✓ updates Clean button text with selected count
```

**Integration:**
```typescript
✓ complete flow: scan → select → confirm → clean
```

---

## 🐛 Debugging Testes

### VSCode Debug

Adicione ao `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### Console Logs

```typescript
import { screen, logRoles } from '@testing-library/react'

it('debug test', () => {
  const { container } = render(<MyComponent />)

  // Log all roles
  logRoles(container)

  // Log DOM tree
  screen.debug()

  // Log specific element
  screen.debug(screen.getByText('Hello'))
})
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:once
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## 📚 Recursos Adicionais

- [Vitest Docs](https://vitest.dev)
- [Testing Library Docs](https://testing-library.com/react)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Principles](https://testing-library.com/docs/guiding-principles)

---

## ✨ Contribuindo com Testes

Ao adicionar novas features, certifique-se de:

1. **✅ Escrever testes antes (TDD)**
2. **✅ Cobrir casos de borda**
3. **✅ Testar comportamento, não implementação**
4. **✅ Manter coverage acima de 80%**
5. **✅ Rodar `npm run test:once` antes de commitar**

---

**Última Atualização:** 16/11/2025
**Maintainer:** Clean RN Team
