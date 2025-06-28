import { toast } from 'sonner'

// Utilitários para notificações padronizadas
export const notifications = {
  // Scan notifications
  scanStart: () =>
    toast.loading('Iniciando scan do sistema...', {
      description: 'Procurando por arquivos cache e temporários',
      duration: Infinity,
    }),

  scanProgress: (
    taskName: string,
    current: number,
    total: number,
    spaceFound: string,
    toastId?: string | number
  ) =>
    toast.loading(`Scaneando ${taskName}...`, {
      id: toastId,
      description: `${current}/${total} - ${spaceFound} encontrados`,
    }),

  scanSuccess: (
    spaceFound: string,
    categoriesCount: number,
    toastId?: string | number
  ) =>
    toast.success('Scan concluído com sucesso!', {
      id: toastId,
      description: `${spaceFound} encontrados em ${categoriesCount} categorias`,
      duration: 5000,
    }),

  scanError: (error: string, toastId?: string | number) =>
    toast.error('Falha no scan do sistema', {
      id: toastId,
      description: error,
      duration: 5000,
    }),

  // Clean notifications
  cleanStart: (categoriesCount: number) =>
    toast.loading('Iniciando limpeza...', {
      description: `${categoriesCount} categorias serão limpas`,
      duration: Infinity,
    }),

  cleanProgress: (
    taskName: string,
    current: number,
    total: number,
    spaceFreed: string,
    toastId?: string | number
  ) =>
    toast.loading(`Limpando ${taskName}...`, {
      id: toastId,
      description: `${current}/${total} - ${spaceFreed} liberados`,
    }),

  cleanSuccess: (
    spaceFreed: string,
    filesDeleted: number,
    duration: string,
    toastId?: string | number
  ) =>
    toast.success('Limpeza concluída com sucesso!', {
      id: toastId,
      description: `${spaceFreed} liberados • ${filesDeleted} arquivos removidos • ${duration}`,
      duration: 7000,
    }),

  cleanWarning: (
    spaceFreed: string,
    filesDeleted: number,
    duration: string,
    errorsCount: number,
    toastId?: string | number
  ) =>
    toast.warning('Limpeza concluída com avisos', {
      id: toastId,
      description: `${spaceFreed} liberados • ${filesDeleted} arquivos removidos • ${duration} • ${errorsCount} erro(s)`,
      duration: 7000,
    }),

  cleanError: (error: string, toastId?: string | number) =>
    toast.error('Falha na limpeza do sistema', {
      id: toastId,
      description: error,
      duration: 5000,
    }),

  cleanNoItems: (reason: string) =>
    toast.warning('Nenhum item encontrado para limpeza', {
      description: reason,
      duration: 5000,
    }),

  // System notifications
  systemReady: () =>
    toast.success('Sistema inicializado com sucesso!', {
      description:
        'Clean RN está pronto para otimizar seu ambiente de desenvolvimento',
      duration: 3000,
    }),

  systemError: (error: string) =>
    toast.error('Falha na inicialização do sistema', {
      description: `Alguns recursos podem não funcionar corretamente: ${error}`,
      duration: 5000,
    }),

  // Debug notifications
  debugStart: () =>
    toast.loading('Executando diagnósticos...', {
      description: 'Testando conexões e funcionalidades',
      duration: Infinity,
    }),

  debugSuccess: (
    successCount: number,
    totalTests: number,
    toastId?: string | number
  ) =>
    toast.success('Todos os testes passaram!', {
      id: toastId,
      description: `${successCount}/${totalTests} testes bem-sucedidos`,
      duration: 5000,
    }),

  debugWarning: (
    successCount: number,
    totalTests: number,
    toastId?: string | number
  ) =>
    toast.warning('Alguns testes falharam', {
      id: toastId,
      description: `${successCount}/${totalTests} testes bem-sucedidos`,
      duration: 5000,
    }),

  debugError: (
    successCount: number,
    totalTests: number,
    toastId?: string | number
  ) =>
    toast.error('Todos os testes falharam', {
      id: toastId,
      description: `${successCount}/${totalTests} testes bem-sucedidos`,
      duration: 5000,
    }),

  // Info notifications
  logsToConsole: () =>
    toast.info('Logs enviados para o console', {
      description: 'Pressione F12 para abrir o DevTools e ver os detalhes',
      duration: 4000,
    }),

  taskError: (taskName: string, error: string) =>
    toast.error(`Erro ao processar ${taskName}`, {
      description: `${error}`,
      duration: 4000,
    }),

  // Generic notifications
  info: (title: string, description?: string) =>
    toast.info(title, {
      description,
      duration: 4000,
    }),

  success: (title: string, description?: string) =>
    toast.success(title, {
      description,
      duration: 5000,
    }),

  warning: (title: string, description?: string) =>
    toast.warning(title, {
      description,
      duration: 5000,
    }),

  error: (title: string, description?: string) =>
    toast.error(title, {
      description,
      duration: 5000,
    }),
}

// Exemplo de uso:
// notifications.scanStart();
// notifications.cleanSuccess('150 MB', 25, '2.5s');
// notifications.systemReady();
