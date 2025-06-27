// Mock implementation for testing without Rust backend
import { CleaningResult, ScanResult, SystemInfo } from './tauri';

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mock para diferentes tipos de cache
const MOCK_SCAN_RESULTS: Record<string, ScanResult[]> = {
  expo: [
    { path: '/Users/dev/.expo/cache/temp1', size: 1024 * 1024 * 50, file_type: 'cache', can_delete: true },
    { path: '/Users/dev/.expo/cache/temp2', size: 1024 * 1024 * 25, file_type: 'cache', can_delete: true },
  ],
  metro: [
    { path: '/tmp/metro-cache/bundle1', size: 1024 * 1024 * 30, file_type: 'cache', can_delete: true },
    { path: '/tmp/metro-cache/bundle2', size: 1024 * 1024 * 15, file_type: 'cache', can_delete: true },
  ],
  npm: [
    { path: '~/.npm/_cacache/index-v5/1a/2b', size: 1024 * 1024 * 100, file_type: 'cache', can_delete: true },
    { path: '~/.npm/_cacache/index-v5/3c/4d', size: 1024 * 1024 * 75, file_type: 'cache', can_delete: true },
  ],
  ios: [
    { path: '~/Library/Developer/Xcode/DerivedData/build1', size: 1024 * 1024 * 200, file_type: 'build', can_delete: true },
  ],
  android: [
    { path: '~/.gradle/caches/modules-2', size: 1024 * 1024 * 150, file_type: 'cache', can_delete: true },
  ],
  watchman: [
    { path: '/usr/local/var/run/watchman/logs/watchman.log', size: 1024 * 1024 * 10, file_type: 'log', can_delete: true },
  ],
  cocoapods: [
    { path: '~/Library/Caches/CocoaPods/Pods/', size: 1024 * 1024 * 80, file_type: 'cache', can_delete: true },
  ],
  flipper: [
    { path: '~/.flipper/logs/flipper.log', size: 1024 * 1024 * 5, file_type: 'log', can_delete: true },
  ],
  temp: [
    { path: '/tmp/react-native-temp1', size: 1024 * 1024 * 20, file_type: 'temp', can_delete: true },
    { path: '/tmp/react-native-temp2', size: 1024 * 1024 * 15, file_type: 'temp', can_delete: true },
  ],
  docker: [
    { path: 'container_123', size: 1024 * 1024 * 500, file_type: 'docker_container', can_delete: true },
    { path: 'image_456', size: 1024 * 1024 * 300, file_type: 'docker_image', can_delete: true },
  ],
};

export class MockTauriService {
  static async scanExpoCache(): Promise<ScanResult[]> {
    await delay(800);
    return MOCK_SCAN_RESULTS.expo;
  }

  static async scanMetroCache(): Promise<ScanResult[]> {
    await delay(600);
    return MOCK_SCAN_RESULTS.metro;
  }

  static async scanIosCache(): Promise<ScanResult[]> {
    await delay(1200);
    return MOCK_SCAN_RESULTS.ios;
  }

  static async scanAndroidCache(): Promise<ScanResult[]> {
    await delay(1000);
    return MOCK_SCAN_RESULTS.android;
  }

  static async scanNpmCache(): Promise<ScanResult[]> {
    await delay(900);
    return MOCK_SCAN_RESULTS.npm;
  }

  static async scanWatchmanCache(): Promise<ScanResult[]> {
    await delay(400);
    return MOCK_SCAN_RESULTS.watchman;
  }

  static async scanCocoaPodsCache(): Promise<ScanResult[]> {
    await delay(700);
    return MOCK_SCAN_RESULTS.cocoapods;
  }

  static async scanFlipperLogs(): Promise<ScanResult[]> {
    await delay(300);
    return MOCK_SCAN_RESULTS.flipper;
  }

  static async scanTempFiles(): Promise<ScanResult[]> {
    await delay(500);
    return MOCK_SCAN_RESULTS.temp;
  }

  static async scanDockerContainers(): Promise<ScanResult[]> {
    await delay(1500);
    return MOCK_SCAN_RESULTS.docker.filter(item => item.file_type === 'docker_container');
  }

  static async scanDockerImages(): Promise<ScanResult[]> {
    await delay(1000);
    return MOCK_SCAN_RESULTS.docker.filter(item => item.file_type === 'docker_image');
  }

  static async scanDockerVolumes(): Promise<ScanResult[]> {
    await delay(800);
    return [];
  }

  static async scanDockerCache(): Promise<ScanResult[]> {
    await delay(600);
    return [];
  }

  static async cleanDockerResources(resourcePaths: string[]): Promise<CleaningResult> {
    await delay(2000);
    const totalSize = resourcePaths.length * 1024 * 1024 * 100; // Mock 100MB per resource
    return {
      files_deleted: resourcePaths.length,
      space_freed: totalSize,
      duration: 2000,
      errors: [],
    };
  }

  static async scanNodeModules(projectPath: string): Promise<ScanResult[]> {
    await delay(1200);
    return [
      { path: `${projectPath}/node_modules/.cache`, size: 1024 * 1024 * 250, file_type: 'cache', can_delete: true },
    ];
  }

  static async cleanFiles(filePaths: string[]): Promise<CleaningResult> {
    await delay(Math.min(filePaths.length * 200, 3000)); // Simular tempo proporcional
    
    const totalSize = filePaths.reduce((sum, path) => {
      // Simular tamanho baseado no path mock
      for (const [key, results] of Object.entries(MOCK_SCAN_RESULTS)) {
        const found = results.find(r => r.path === path);
        if (found) return sum + found.size;
      }
      return sum + 1024 * 1024 * 10; // Default 10MB
    }, 0);

    // Simular alguns erros ocasionais
    const errors: string[] = [];
    if (Math.random() < 0.1) { // 10% chance de erro
      errors.push(`Permission denied: ${filePaths[0]}`);
    }

    return {
      files_deleted: filePaths.length - errors.length,
      space_freed: totalSize,
      duration: Math.min(filePaths.length * 200, 3000),
      errors,
    };
  }

  static async getSystemInfo(): Promise<SystemInfo> {
    await delay(500);
    return {
      home_dir: '/Users/dev',
      installed_tools: ['node', 'npm', 'expo-cli', 'react-native-cli', 'cocoapods'],
    };
  }

  static async greet(name: string): Promise<string> {
    await delay(100);
    return `Hello, ${name}! Mock Tauri service is working!`;
  }
} 