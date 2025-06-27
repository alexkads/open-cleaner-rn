import { invoke } from '@tauri-apps/api/core';

export interface ScanResult {
  path: string;
  size: number;
  file_type: string;
  can_delete: boolean;
}

export interface CleaningResult {
  files_deleted: number;
  space_freed: number;
  duration: number;
  errors: string[];
}

export interface SystemInfo {
  home_dir: string;
  installed_tools: string[];
}

export class TauriService {
  static async scanExpoCache(): Promise<ScanResult[]> {
    return await invoke('scan_expo_cache');
  }

  static async scanNodeModules(projectPath: string): Promise<ScanResult[]> {
    return await invoke('scan_node_modules', { projectPath });
  }

  static async cleanFiles(filePaths: string[]): Promise<CleaningResult> {
    return await invoke('clean_files', { filePaths });
  }

  static async getSystemInfo(): Promise<SystemInfo> {
    return await invoke('get_system_info');
  }

  static async greet(name: string): Promise<string> {
    return await invoke('greet', { name });
  }
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}; 