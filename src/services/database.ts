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

export class DatabaseService {
  private static db: Database | null = null;

  static async init(): Promise<void> {
    if (!this.db) {
      this.db = await Database.load('sqlite:clean_rn_dev.db');
      await this.createTables();
    }
  }

  private static async createTables(): Promise<void> {
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
    if (!this.db) await this.init();
    
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
  }

  static async getCleaningHistory(limit: number = 50): Promise<CleaningHistory[]> {
    if (!this.db) await this.init();
    
    const result = await this.db!.select<CleaningHistory[]>(
      `SELECT * FROM cleaning_history 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [limit]
    );

    return result;
  }

  static async getCleaningStats(): Promise<{
    total_space_cleaned: number;
    total_files_deleted: number;
    total_sessions: number;
    avg_duration: number;
  }> {
    if (!this.db) await this.init();
    
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
  }

  static async deleteCleaningRecord(id: number): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.execute(
      'DELETE FROM cleaning_history WHERE id = ?',
      [id]
    );
  }

  static async clearAllHistory(): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.execute('DELETE FROM cleaning_history');
  }

  static async getSetting(key: string): Promise<string | null> {
    if (!this.db) await this.init();
    
    const result = await this.db!.select<{value: string}[]>(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );

    return result.length > 0 ? result[0].value : null;
  }

  static async setSetting(key: string, value: string): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.execute(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) 
       VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [key, value]
    );
  }

  static async exportHistory(): Promise<CleaningHistory[]> {
    return await this.getCleaningHistory(1000);
  }
} 