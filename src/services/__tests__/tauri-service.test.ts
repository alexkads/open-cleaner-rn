import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CleaningResult, ScanResult, SystemInfo, TauriService } from '../tauri';

// Mock do @tauri-apps/api/core
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

import { invoke } from '@tauri-apps/api/core';
const mockInvoke = vi.mocked(invoke);

describe('TauriService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scan Methods', () => {
    const mockScanResult: ScanResult[] = [
      {
        path: '/test/path',
        size: 1024000,
        file_type: 'cache',
        can_delete: true,
      },
    ];

    test('scanExpoCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanExpoCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_expo_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanMetroCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanMetroCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_metro_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanIosCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanIosCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_ios_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanAndroidCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanAndroidCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_android_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanNpmCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanNpmCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_npm_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanWatchmanCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanWatchmanCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_watchman_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanCocoaPodsCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanCocoaPodsCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_cocoapods_cache');
      expect(result).toEqual(mockScanResult);
    });

    test('scanFlipperLogs should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanFlipperLogs();

      expect(mockInvoke).toHaveBeenCalledWith('scan_flipper_logs');
      expect(result).toEqual(mockScanResult);
    });

    test('scanTempFiles should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockScanResult);

      const result = await TauriService.scanTempFiles();

      expect(mockInvoke).toHaveBeenCalledWith('scan_temp_files');
      expect(result).toEqual(mockScanResult);
    });
  });

  describe('Docker Scan Methods', () => {
    const mockDockerResult: ScanResult[] = [
      {
        path: 'container_id',
        size: 2048000,
        file_type: 'docker_container',
        can_delete: true,
      },
    ];

    test('scanDockerContainers should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockDockerResult);

      const result = await TauriService.scanDockerContainers();

      expect(mockInvoke).toHaveBeenCalledWith('scan_docker_containers');
      expect(result).toEqual(mockDockerResult);
    });

    test('scanDockerImages should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockDockerResult);

      const result = await TauriService.scanDockerImages();

      expect(mockInvoke).toHaveBeenCalledWith('scan_docker_images');
      expect(result).toEqual(mockDockerResult);
    });

    test('scanDockerVolumes should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockDockerResult);

      const result = await TauriService.scanDockerVolumes();

      expect(mockInvoke).toHaveBeenCalledWith('scan_docker_volumes');
      expect(result).toEqual(mockDockerResult);
    });

    test('scanDockerCache should call correct tauri command', async () => {
      mockInvoke.mockResolvedValue(mockDockerResult);

      const result = await TauriService.scanDockerCache();

      expect(mockInvoke).toHaveBeenCalledWith('scan_docker_cache');
      expect(result).toEqual(mockDockerResult);
    });
  });

  describe('Cleaning Methods', () => {
    const mockCleaningResult: CleaningResult = {
      files_deleted: 25,
      space_freed: 1024000,
      duration: 3000,
      errors: [],
    };

    test('cleanDockerResources should call correct tauri command with parameters', async () => {
      const resourcePaths = ['/path1', '/path2'];
      mockInvoke.mockResolvedValue(mockCleaningResult);

      const result = await TauriService.cleanDockerResources(resourcePaths);

      expect(mockInvoke).toHaveBeenCalledWith('clean_docker_resources', {
        resourcePaths,
      });
      expect(result).toEqual(mockCleaningResult);
    });

    test('cleanFiles should call correct tauri command with parameters', async () => {
      const filePaths = ['/file1', '/file2'];
      mockInvoke.mockResolvedValue(mockCleaningResult);

      const result = await TauriService.cleanFiles(filePaths);

      expect(mockInvoke).toHaveBeenCalledWith('clean_files', {
        filePaths,
      });
      expect(result).toEqual(mockCleaningResult);
    });
  });

  describe('Other Methods', () => {
    test('scanNodeModules should call correct tauri command with project path', async () => {
      const projectPath = '/path/to/project';
      const mockResult: ScanResult[] = [];
      mockInvoke.mockResolvedValue(mockResult);

      const result = await TauriService.scanNodeModules(projectPath);

      expect(mockInvoke).toHaveBeenCalledWith('scan_node_modules', {
        projectPath,
      });
      expect(result).toEqual(mockResult);
    });

    test('getSystemInfo should call correct tauri command', async () => {
      const mockSystemInfo: SystemInfo = {
        home_dir: '/home/user',
        installed_tools: ['node', 'npm', 'expo'],
      };
      mockInvoke.mockResolvedValue(mockSystemInfo);

      const result = await TauriService.getSystemInfo();

      expect(mockInvoke).toHaveBeenCalledWith('get_system_info');
      expect(result).toEqual(mockSystemInfo);
    });

    test('greet should call correct tauri command with name parameter', async () => {
      const name = 'Test User';
      const mockGreeting = 'Hello, Test User!';
      mockInvoke.mockResolvedValue(mockGreeting);

      const result = await TauriService.greet(name);

      expect(mockInvoke).toHaveBeenCalledWith('greet', { name });
      expect(result).toBe(mockGreeting);
    });
  });

  describe('Error Handling', () => {
    test('should handle invoke errors gracefully', async () => {
      const error = new Error('Tauri command failed');
      mockInvoke.mockRejectedValue(error);

      await expect(TauriService.scanExpoCache()).rejects.toThrow('Tauri command failed');
      expect(mockInvoke).toHaveBeenCalledWith('scan_expo_cache');
    });

    test('should handle cleaning errors gracefully', async () => {
      const error = new Error('Clean operation failed');
      mockInvoke.mockRejectedValue(error);

      await expect(TauriService.cleanFiles(['/test'])).rejects.toThrow('Clean operation failed');
      expect(mockInvoke).toHaveBeenCalledWith('clean_files', { filePaths: ['/test'] });
    });
  });
}); 