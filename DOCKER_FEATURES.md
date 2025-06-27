# 🐳 Funcionalidades Docker - Clean RN Dev

## Visão Geral

O Clean RN Dev agora inclui funcionalidades abrangentes para limpeza de recursos Docker desnecessários, essencial para desenvolvedores React Native/Expo que utilizam Docker em seus projetos de desenvolvimento.

## 🚀 Funcionalidades Implementadas

### 1. **Docker Containers** 
- **Função**: `scan_docker_containers()`
- **Descrição**: Detecta containers Docker parados e não utilizados
- **Comando**: `docker container ls -a --filter status=exited`
- **Limpeza**: `docker container rm <container_id>`
- **Detecção**: Containers com status "exited"

### 2. **Docker Images**
- **Função**: `scan_docker_images()`
- **Descrição**: Encontra imagens Docker órfãs e não utilizadas
- **Comando**: `docker images -f dangling=true`
- **Limpeza**: `docker image rm <image_id>`
- **Detecção**: Imagens "dangling" (sem tag)

### 3. **Docker Volumes**
- **Função**: `scan_docker_volumes()`
- **Descrição**: Identifica volumes Docker órfãos sem containers ativos
- **Comando**: `docker volume ls -f dangling=true`
- **Limpeza**: `docker volume rm <volume_name>`
- **Detecção**: Volumes não associados a containers

### 4. **Docker Build Cache**
- **Função**: `scan_docker_cache()`
- **Descrição**: Cache de builds Docker e camadas intermediárias
- **Comando**: `docker system df`
- **Limpeza**: `docker builder prune -f`
- **Detecção**: Build cache reclaimable

## 🛡️ Recursos de Segurança

### **Detecção Inteligente**
- ✅ Verifica se Docker está instalado antes de executar comandos
- ✅ Usa `which::which("docker")` para detectar disponibilidade
- ✅ Retorna resultados vazios se Docker não estiver disponível
- ✅ Não gera erros se Docker não estiver instalado

### **Limpeza Segura**
- ✅ Remove apenas recursos **não utilizados** e **seguros**
- ✅ **Não remove**: containers em execução, imagens em uso, volumes ativos
- ✅ **Remove apenas**: containers parados, imagens órfãs, volumes desconectados
- ✅ Usa filtros Docker para garantir segurança (`--filter status=exited`, `dangling=true`)

### **Tratamento de Erros**
- ✅ Captura e reporta erros de comandos Docker
- ✅ Continua operação mesmo se alguns recursos falharem
- ✅ Logs detalhados de erros para troubleshooting
- ✅ Não interrompe limpeza de outros tipos de cache

## 🔧 Implementação Técnica

### **Backend (Rust)**
```rust
// Verificação se Docker está disponível
if which::which("docker").is_err() {
    return Ok(results); // Retorna vazio se não tiver Docker
}

// Execução segura de comandos Docker
let output = Command::new("docker")
    .args(&["container", "ls", "-a", "--filter", "status=exited"])
    .output();
```

### **Frontend (TypeScript)**
```typescript
// Integração com TauriService
static async scanDockerContainers(): Promise<ScanResult[]> {
  return await invoke('scan_docker_containers');
}

// Limpeza específica para recursos Docker
if (task.type.startsWith('docker_')) {
  result = await TauriService.cleanDockerResources(dockerPaths);
}
```

## 📊 Detecção de Tamanho

### **Parsing Inteligente**
- ✅ Suporta formatos Docker: `1.2MB`, `500KB`, `2.1GB`
- ✅ Conversão automática para bytes
- ✅ Tratamento de casos especiais: `0B`, `0`
- ✅ Estimativas para recursos que não reportam tamanho exato

### **Estimativas Conservadoras**
- **Containers**: Tamanho real reportado pelo Docker
- **Images**: Tamanho real das camadas
- **Volumes**: Estimativa de 1MB + parsing de `docker system df`
- **Build Cache**: Tamanho "reclaimable" do `system df`

## 🎯 Casos de Uso

### **Desenvolvimento React Native/Expo**
- 🐳 **Containers de Build**: Remove containers de builds antigos
- 🐳 **Images de Base**: Limpa images Node.js, React Native antigas
- 🐳 **Volumes de Cache**: Remove caches de node_modules em volumes
- 🐳 **Build Layers**: Limpa camadas intermediárias não utilizadas

### **Cenários Comuns**
- **Após mudança de versão Node.js**: Remove images antigas
- **Limpeza de projetos descontinuados**: Remove containers órfãos
- **Otimização de espaço**: Libera GB de cache desnecessário
- **CI/CD cleanup**: Remove artefatos de builds automatizados

## 📈 Benefícios

### **Economia de Espaço**
- ⚡ **Containers**: 10-500MB por container parado
- ⚡ **Images**: 100MB-2GB por image órfã
- ⚡ **Volumes**: 10-500MB por volume órfão
- ⚡ **Build Cache**: 500MB-5GB+ de cache

### **Performance**
- 🚀 Melhora performance do Docker
- 🚀 Reduz tempo de listagem de recursos
- 🚀 Otimiza uso de disco
- 🚀 Acelera pulls de novas images

## 🔄 Fluxo de Operação

### **1. Scan Automático**
```
1. Verifica se Docker está instalado
2. Executa comandos de listagem Docker
3. Parseia resultados e calcula tamanhos
4. Filtra apenas recursos seguros para remoção
5. Apresenta na interface com descrições
```

### **2. Limpeza Inteligente**
```
1. Identifica recursos Docker selecionados
2. Usa função cleanDockerResources específica
3. Executa comandos Docker apropriados
4. Monitora progresso e erros
5. Reporta resultados detalhados
```

## ⚠️ Considerações Importantes

### **Limitações**
- 📝 Requer Docker instalado e funcionando
- 📝 Precisa de permissões para executar comandos Docker
- 📝 Alguns tamanhos são estimativas (volumes)
- 📝 Não remove recursos em uso por segurança

### **Compatibilidade**
- ✅ **macOS**: Docker Desktop, Docker CE
- ✅ **Windows**: Docker Desktop, WSL2
- ✅ **Linux**: Docker CE, Docker Desktop
- ✅ **Multiplataforma**: Comandos Docker universais

## 🎉 Resultado Final

O Clean RN Dev agora oferece uma solução **completa e segura** para limpeza de recursos Docker, integrando perfeitamente com o workflow de desenvolvimento React Native/Expo e proporcionando:

- 🧹 **Limpeza inteligente** de 4 tipos de recursos Docker
- 🛡️ **Segurança total** - remove apenas recursos não utilizados
- 📊 **Feedback visual** com progresso em tempo real
- 🔄 **Integração perfeita** com outros tipos de limpeza
- 📈 **Economia significativa** de espaço em disco

---

**🐳 Docker + Clean RN Dev = Ambiente de desenvolvimento sempre otimizado!** 🚀 