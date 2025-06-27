import { toast } from 'sonner';

// Demo script para testar todas as notificações
export const runToastDemo = () => {
  let currentDemo = 0;
  
  const demos = [
    () => {
      toast.info('🎉 Demo das Notificações', {
        description: 'Vamos demonstrar todos os tipos de toast implementados!',
        duration: 3000
      });
    },
    
    () => {
      const loadingToast = toast.loading('⏳ Loading Toast', {
        description: 'Este é um toast de carregamento',
        duration: 2000
      });
      
      setTimeout(() => {
        toast.success('✅ Convertido para sucesso!', {
          id: loadingToast,
          description: 'O toast de loading foi atualizado para sucesso',
          duration: 3000
        });
      }, 2000);
    },
    
    () => {
      toast.error('❌ Toast de Erro', {
        description: 'Este é um exemplo de notificação de erro',
        duration: 3000
      });
    },
    
    () => {
      toast.warning('⚠️ Toast de Aviso', {
        description: 'Este é um exemplo de notificação de aviso',
        duration: 3000
      });
    },
    
    () => {
      toast.info('ℹ️ Toast Informativo', {
        description: 'Este é um exemplo de notificação informativa',
        duration: 3000
      });
    },
    
    () => {
      // Simular progresso de scan
      const scanToast = toast.loading('🔍 Simulando Scan...', {
        description: '0/9 categorias escaneadas',
        duration: Infinity
      });
      
      let progress = 0;
      const categories = ['Expo Cache', 'Metro Cache', 'NPM Cache', 'iOS Cache', 'Android Cache'];
      
      const interval = setInterval(() => {
        progress++;
        
        if (progress <= categories.length) {
          toast.loading(`🔍 Scaneando ${categories[progress - 1] || 'Sistema'}...`, {
            id: scanToast,
            description: `${progress}/${categories.length} - ${progress * 180} MB encontrados`
          });
        }
        
        if (progress >= categories.length) {
          clearInterval(interval);
          setTimeout(() => {
            toast.success('🎉 Scan Completo!', {
              id: scanToast,
              description: `915 MB encontrados em ${categories.length} categorias`,
              duration: 4000
            });
          }, 1000);
        }
      }, 800);
    },
    
    () => {
      // Simular progresso de limpeza
      const cleanToast = toast.loading('🧹 Simulando Limpeza...', {
        description: '0/5 categorias limpas',
        duration: Infinity
      });
      
      let progress = 0;
      const categories = ['Expo Cache', 'Metro Cache', 'NPM Cache', 'iOS Cache', 'Android Cache'];
      
      const interval = setInterval(() => {
        progress++;
        
        if (progress <= categories.length) {
          toast.loading(`🧹 Limpando ${categories[progress - 1] || 'Sistema'}...`, {
            id: cleanToast,
            description: `${progress}/${categories.length} - ${progress * 180} MB liberados`
          });
        }
        
        if (progress >= categories.length) {
          clearInterval(interval);
          setTimeout(() => {
            toast.success('✨ Limpeza Concluída!', {
              id: cleanToast,
              description: '915 MB liberados • 347 arquivos removidos • 3.2s',
              duration: 5000
            });
          }, 1000);
        }
      }, 600);
    },
    
    () => {
      toast.success('🎊 Demo Concluída!', {
        description: 'Todas as notificações foram demonstradas com sucesso!',
        duration: 4000
      });
    }
  ];
  
  const runNext = () => {
    if (currentDemo < demos.length) {
      demos[currentDemo]();
      currentDemo++;
      
      // Agendar próxima demo
      setTimeout(runNext, currentDemo === 2 || currentDemo === 6 || currentDemo === 7 ? 6000 : 4000);
    }
  };
  
  runNext();
};

// Para testar, execute no console:
// import { runToastDemo } from './src/utils/toast-demo.ts';
// runToastDemo(); 