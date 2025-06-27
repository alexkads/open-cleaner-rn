# 🧪 Documentação de Testes - Clean RN Dev

Este documento descreve a estrutura de testes do projeto Clean RN Dev, uma aplicação Tauri + React para limpeza de cache de desenvolvimento React Native.

## 📋 Visão Geral

O projeto possui testes unitários abrangentes que cobrem:
- **Serviços**: DatabaseService e TauriService
- **Funções utilitárias**: Formatação de dados e validação
- **Componentes React**: Estrutura básica da aplicação

## 🛠️ Tecnologias de Teste

- **Vitest**: Framework de testes moderno e rápido
- **Testing Library**: Para testes de componentes React
- **JSDOM**: Ambiente de DOM para testes
- **Mocks**: Para isolar dependências externas (Tauri APIs)

## 🗂️ Estrutura de Arquivos

```
src/
├── services/
│   ├── __tests__/
│   │   ├── database.test.ts      # Testes do DatabaseService
│   │   ├── tauri.test.ts         # Testes das funções utilitárias
│   │   └── tauri-service.test.ts # Testes do TauriService
│   ├── database.ts
│   └── tauri.ts
├── utils/
│   └── __tests__/
│       └── validation.test.ts    # Testes de validação
├── test-setup.ts                 # Configuração global dos testes
└── ...
```

## 🚀 Como Executar os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
pnpm test -- --run

# Executar testes em modo watch (desenvolvimento)
pnpm test

# Executar testes com interface visual
pnpm test:ui

# Executar testes com cobertura
pnpm test:coverage
```

### Executar Testes Específicos

```bash
# Executar apenas testes de serviços
pnpm test -- --run src/services/

# Executar teste específico
pnpm test -- --run src/services/__tests__/database.test.ts

# Executar testes que contêm uma palavra-chave
pnpm test -- --run --grep "DatabaseService"
```

## 📊 Cobertura de Testes

### Serviços Testados

#### 🗄️ DatabaseService
- ✅ Inicialização do banco de dados
- ✅ Criação de tabelas
- ✅ Operações CRUD de histórico de limpeza
- ✅ Estatísticas de limpeza
- ✅ Configurações do sistema
- ✅ Exportação de dados

#### ⚡ TauriService
- ✅ Todos os métodos de scan (Expo, Metro, iOS, Android, NPM, etc.)
- ✅ Operações de limpeza
- ✅ Integração com Docker
- ✅ Informações do sistema
- ✅ Tratamento de erros

#### 🛠️ Funções Utilitárias
- ✅ `formatBytes()`: Formatação de tamanhos de arquivo
- ✅ `formatDuration()`: Formatação de duração de tempo
- ✅ Funções de validação de dados
- ✅ Cálculos de porcentagem
- ✅ Sanitização de mensagens de erro

## 🎯 Exemplos de Testes

### Teste de Formatação de Bytes
```typescript
test('should format gigabytes correctly', () => {
  expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  expect(formatBytes(1024 * 1024 * 1024 * 1.25)).toBe('1.25 GB');
});
```

### Teste de DatabaseService com Mock
```typescript
test('should add cleaning record successfully', async () => {
  mockDb.execute.mockResolvedValue({ lastInsertId: 1 });

  const result = await DatabaseService.addCleaningRecord(mockRecord);

  expect(mockDb.execute).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO cleaning_history'),
    expect.arrayContaining([mockRecord.date, mockRecord.time])
  );
  expect(result).toBe(1);
});
```

### Teste de TauriService
```typescript
test('scanExpoCache should call correct tauri command', async () => {
  mockInvoke.mockResolvedValue(mockScanResult);

  const result = await TauriService.scanExpoCache();

  expect(mockInvoke).toHaveBeenCalledWith('scan_expo_cache');
  expect(result).toEqual(mockScanResult);
});
```

## 🔧 Configuração de Mocks

### Tauri API Mock
```typescript
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-sql', () => ({
  default: {
    load: vi.fn(() => Promise.resolve(mockDb)),
  },
}));
```

### Framer Motion Mock
```typescript
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
```

## 📈 Melhores Práticas

### ✅ Boas Práticas Implementadas

1. **Isolamento de Testes**: Cada teste é independente usando `beforeEach()` para resetar mocks
2. **Mocks Adequados**: APIs externas (Tauri) são mockadas para testes unitários puros
3. **Testes de Edge Cases**: Validação de cenários limites e entradas inválidas
4. **Nomenclatura Clara**: Testes descrevem claramente o comportamento esperado
5. **Estrutura Organizada**: Testes agrupados por funcionalidade usando `describe()`

### 📝 Convenções de Nomenclatura

- **describe()**: Descreve o componente/função sendo testada
- **test()**: Descreve o comportamento específico em formato "should..."
- **Variáveis Mock**: Prefixo `mock` para clareza

## 🐛 Debugging de Testes

### Comandos Úteis

```bash
# Executar um único teste com logs detalhados
pnpm test -- --run --reporter=verbose nome-do-teste

# Executar testes com debug
pnpm test -- --run --inspect-brk

# Ver apenas testes que falharam
pnpm test -- --run --reporter=verbose --failed
```

### Troubleshooting Comum

1. **Mock não funciona**: Verificar se o mock está antes do import
2. **Testes lentos**: Usar `--run` para executar uma vez apenas
3. **Ambiente JSdom**: Alguns APIs podem não estar disponíveis

## 🎯 Objetivos dos Testes

### Segurança e Confiabilidade
- ✅ Validação de entrada de dados
- ✅ Prevenção de injeção SQL (através dos mocks do banco)
- ✅ Sanitização de dados sensíveis
- ✅ Tratamento adequado de erros

### Manutenibilidade
- ✅ Detecção precoce de regressões
- ✅ Documentação viva do comportamento do código
- ✅ Facilita refatoração segura
- ✅ Integração contínua

## 📝 Como Adicionar Novos Testes

1. **Criar arquivo de teste**: `nome.test.ts` ou `nome.test.tsx`
2. **Importar dependências**: Vitest e funções a serem testadas
3. **Configurar mocks**: Se necessário para dependências externas
4. **Escrever testes**: Seguir padrão describe > test
5. **Executar e verificar**: `pnpm test -- --run nome.test.ts`

## 🏆 Resultados

Atualmente, o projeto possui **46 testes passando** cobrindo:
- 12 testes de funções utilitárias (formatação)
- 20 testes do TauriService (integração com Rust)
- 14 testes do DatabaseService (persistência)
- Testes de validação e edge cases

Isso garante que as funcionalidades críticas da aplicação estão bem testadas e funcionando corretamente! 🎉 