import Database from '@tauri-apps/plugin-sql';

export interface CleaningHistory {
  id?: number;
  date: string;
  time: string;
  space_cleaned: number;
  files_deleted: number;
  duration: number;
  type: 'quick' | 'deep' | 'custom';
  status: 'success' | 'warning' | 'error';
  errors?: string;
  created_at?: string;
}

// Mock data for development
const mockHistory: CleaningHistory[] = [];
let mockIdCounter = 1;

// Detectar mock via .env
const useMockEnv = import.meta.env.VITE_USE_MOCK === '1' || import.meta.env.VITE_USE_MOCK === 'true';

export class DatabaseService {
  private static db: Database | null = null;
  private static useMock = useMockEnv;

  static async init(): Promise<void> {
    if (this.useMock) {
      console.log('Using mock database for development');
      return;
    }
    
    if (!this.db) {
      try {
        this.db = await Database.load('sqlite:clean_rn_dev.db');
        await this.createTables();
      } catch (error) {
        console.error('Failed to initialize database, falling back to mock:', error);
        this.useMock = true;
      }
    }
  }

  private static async createTables(): Promise<void> {
    if (this.useMock) return;
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS cleaning_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        space_cleaned INTEGER NOT NULL,
        files_deleted INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('quick', 'deep', 'custom')),
        status TEXT NOT NULL CHECK (status IN ('success', 'warning', 'error')),
        errors TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static async addCleaningRecord(record: Omit<CleaningHistory, 'id' | 'created_at'>): Promise<number> {
    if (this.useMock) {
      const newRecord: CleaningHistory = {
        ...record,
        id: mockIdCounter++,
        created_at: new Date().toISOString()
      };
      mockHistory.unshift(newRecord);
      console.log('Mock: Added cleaning record:', newRecord);
      return newRecord.id!;
    }
    
    if (!this.db) await this.init();
    
    try {
      const result = await this.db!.execute(
        `INSERT INTO cleaning_history 
         (date, time, space_cleaned, files_deleted, duration, type, status, errors) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.date,
          record.time,
          record.space_cleaned,
          record.files_deleted,
          record.duration,
          record.type,
          record.status,
          record.errors || null
        ]
      );

      return result.lastInsertId as number;
    } catch (error) {
      console.error('Failed to add cleaning record:', error);
      throw error;
    }
  }

  static async getCleaningHistory(limit: number = 50): Promise<CleaningHistory[]> {
    if (this.useMock) {
      console.log('Mock: Getting cleaning history, limit:', limit);
      return mockHistory.slice(0, limit);
    }
    
    if (!this.db) await this.init();
    
    try {
      const result = await this.db!.select<CleaningHistory[]>(
        `SELECT * FROM cleaning_history 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [limit]
      );

      return result;
    } catch (error) {
      console.error('Failed to get cleaning history:', error);
      return [];
    }
  }

  static async getCleaningStats(): Promise<{
    total_space_cleaned: number;
    total_files_deleted: number;
    total_sessions: number;
    avg_duration: number;
  }> {
    if (this.useMock) {
      const stats = mockHistory.reduce((acc, record) => ({
        total_space_cleaned: acc.total_space_cleaned + record.space_cleaned,
        total_files_deleted: acc.total_files_deleted + record.files_deleted,
        total_sessions: acc.total_sessions + 1,
        avg_duration: 0 // Will calculate below
      }), {
        total_space_cleaned: 0,
        total_files_deleted: 0,
        total_sessions: 0,
        avg_duration: 0
      });
      
      stats.avg_duration = stats.total_sessions > 0 ? stats.total_space_cleaned / stats.total_sessions : 0;
      console.log('Mock: Getting cleaning stats:', stats);
      return stats;
    }
    
    if (!this.db) await this.init();
    
    try {
      const result = await this.db!.select<any[]>(
        `SELECT 
          SUM(space_cleaned) as total_space_cleaned,
          SUM(files_deleted) as total_files_deleted,
          COUNT(*) as total_sessions,
          AVG(duration) as avg_duration
         FROM cleaning_history`
      );

      return result[0] || {
        total_space_cleaned: 0,
        total_files_deleted: 0,
        total_sessions: 0,
        avg_duration: 0
      };
    } catch (error) {
      console.error('Failed to get cleaning stats:', error);
      return {
        total_space_cleaned: 0,
        total_files_deleted: 0,
        total_sessions: 0,
        avg_duration: 0
      };
    }
  }

  static async deleteCleaningRecord(id: number): Promise<void> {
    if (this.useMock) {
      const index = mockHistory.findIndex(record => record.id === id);
      if (index !== -1) {
        mockHistory.splice(index, 1);
        console.log('Mock: Deleted cleaning record with id:', id);
      }
      return;
    }
    
    if (!this.db) await this.init();
    
    try {
      await this.db!.execute(
        'DELETE FROM cleaning_history WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Failed to delete cleaning record:', error);
      throw error;
    }
  }

  static async clearAllHistory(): Promise<void> {
    if (this.useMock) {
      mockHistory.length = 0;
      console.log('Mock: Cleared all history');
      return;
    }
    
    if (!this.db) await this.init();
    
    try {
      await this.db!.execute('DELETE FROM cleaning_history');
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  }

  static async getSetting(key: string): Promise<string | null> {
    if (this.useMock) {
      console.log('Mock: Getting setting:', key);
      return null; // Mock always returns null for settings
    }
    
    if (!this.db) await this.init();
    
    try {
      const result = await this.db!.select<{value: string}[]>(
        'SELECT value FROM settings WHERE key = ?',
        [key]
      );

      return result.length > 0 ? result[0].value : null;
    } catch (error) {
      console.error('Failed to get setting:', error);
      return null;
    }
  }

  static async setSetting(key: string, value: string): Promise<void> {
    if (this.useMock) {
      console.log('Mock: Setting:', key, '=', value);
      return;
    }
    
    if (!this.db) await this.init();
    
    try {
      await this.db!.execute(
        `INSERT OR REPLACE INTO settings (key, value, updated_at) 
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, value]
      );
    } catch (error) {
      console.error('Failed to set setting:', error);
      throw error;
    }
  }

  static async exportHistory(): Promise<CleaningHistory[]> {
    return await this.getCleaningHistory(1000);
  }
} 