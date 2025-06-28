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
  reactNative: [
    { path: '~/.rncache/metro-cache', size: 1024 * 1024 * 120, file_type: 'cache', can_delete: true },
    { path: '/tmp/react-native-packager-cache', size: 1024 * 1024 * 80, file_type: 'cache', can_delete: true },
  ],
  hermes: [
    { path: '~/Library/Caches/com.facebook.react.native/hermes', size: 1024 * 1024 * 90, file_type: 'cache', can_delete: true },
    { path: '/tmp/hermes-compile-cache', size: 1024 * 1024 * 45, file_type: 'cache', can_delete: true },
  ],
  vscode: [
    { path: '~/Library/Application Support/Code/logs', size: 1024 * 1024 * 25, file_type: 'log', can_delete: true },
    { path: '~/Library/Application Support/Code/CachedExtensions', size: 1024 * 1024 * 150, file_type: 'cache', can_delete: true },
  ],
  androidStudio: [
    { path: '~/Library/Caches/AndroidStudio', size: 1024 * 1024 * 200, file_type: 'cache', can_delete: true },
    { path: '~/Library/Logs/AndroidStudio', size: 1024 * 1024 * 35, file_type: 'log', can_delete: true },
  ],
  buildArtifacts: [
    { path: '~/Desktop/app-release.apk', size: 1024 * 1024 * 45, file_type: 'build', can_delete: true },
    { path: '~/Documents/app.ipa', size: 1024 * 1024 * 68, file_type: 'build', can_delete: true },
  ],
  homebrew: [
    { path: '~/Library/Caches/Homebrew', size: 1024 * 1024 * 300, file_type: 'cache', can_delete: true },
    { path: '/usr/local/var/homebrew/locks', size: 1024 * 1024 * 5, file_type: 'temp', can_delete: true },
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

  static async scanReactNativeCache(): Promise<ScanResult[]> {
    await delay(700);
    return MOCK_SCAN_RESULTS.reactNative;
  }

  static async scanHermesCache(): Promise<ScanResult[]> {
    await delay(500);
    return MOCK_SCAN_RESULTS.hermes;
  }

  static async scanVsCodeCache(): Promise<ScanResult[]> {
    await delay(600);
    return MOCK_SCAN_RESULTS.vscode;
  }

  static async scanAndroidStudioCache(): Promise<ScanResult[]> {
    await delay(900);
    return MOCK_SCAN_RESULTS.androidStudio;
  }

  static async scanBuildArtifacts(): Promise<ScanResult[]> {
    await delay(400);
    return MOCK_SCAN_RESULTS.buildArtifacts;
  }

  static async scanHomebrewCache(): Promise<ScanResult[]> {
    await delay(800);
    return MOCK_SCAN_RESULTS.homebrew;
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
    if (!filePaths || filePaths.length === 0) {
      return {
        files_deleted: 0,
        space_freed: 0,
        duration: 0,
        errors: ['No files provided for cleaning']
      };
    }

    await delay(Math.min(filePaths.length * 200, 3000)); // Simular tempo proporcional
    
    const totalSize = filePaths.reduce((sum, path) => {
      // Simular tamanho baseado no path mock
      for (const [, results] of Object.entries(MOCK_SCAN_RESULTS)) {
        const found = results.find(r => r.path === path);
        if (found) return sum + found.size;
      }
      return sum + 1024 * 1024 * 10; // Default 10MB
    }, 0);

    // Remover simulação de erros aleatórios para tornar mais estável
    const errors: string[] = [];
    
    // Simular apenas erros específicos em casos muito raros (1% chance)
    if (Math.random() < 0.01 && filePaths.length > 0) {
      errors.push(`Mock permission error: ${filePaths[0]}`);
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