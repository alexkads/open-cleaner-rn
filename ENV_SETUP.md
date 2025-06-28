# 🔧 Configuração de Variáveis de Ambiente

## 📋 Como usar

1. **Copie o arquivo de exemplo:**
   ```bash
   cp env.example .env
   ```

2. **Edite o arquivo `.env` conforme necessário**

3. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🎭 Variáveis Disponíveis

### `VITE_USE_MOCK`
Controla se o sistema usa serviços mock ou reais.

- **`VITE_USE_MOCK=1`** - Usa serviços mock (recomendado para desenvolvimento)
- **`VITE_USE_MOCK=0`** - Usa serviços Tauri reais
- **`VITE_USE_MOCK=true`** - Usa serviços mock
- **`VITE_USE_MOCK=false`** - Usa serviços Tauri reais

### Exemplo de `.env`:
```env
# Usar mock para desenvolvimento
VITE_USE_MOCK=1

# Usar serviços reais para produção
# VITE_USE_MOCK=0
```

## 🔍 Como verificar se está usando mock

1. **Abra o console do navegador (F12)**
2. **Procure por mensagens como:**
   ```
   Using mock database for development
   Mock: Added cleaning record: {...}
   ```

3. **Ou use o Debug Panel** (botão bug no canto inferior direito)

## 🚀 Dicas

- **Desenvolvimento:** Use `VITE_USE_MOCK=1` para testes rápidos
- **Produção:** Use `VITE_USE_MOCK=0` para funcionalidade real
- **Debugging:** O console mostrará logs específicos do mock

## 🔄 Alternando entre mock e real

Para alternar rapidamente:

1. **Edite o arquivo `.env`**
2. **Mude o valor de `VITE_USE_MOCK`**
3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

## 📝 Notas

- Todas as variáveis devem começar com `VITE_` para serem acessíveis no frontend
- O arquivo `.env` não deve ser commitado no git (já está no .gitignore)
- Use `env.example` como template para configurações 