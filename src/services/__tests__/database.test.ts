import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CleaningHistory, DatabaseService } from '../database'

// Mock do @tauri-apps/plugin-sql
const mockDb = {
  execute: vi.fn(),
  select: vi.fn(),
}

vi.mock('@tauri-apps/plugin-sql', () => ({
  default: {
    load: vi.fn(() => Promise.resolve(mockDb)),
  },
}))

describe('DatabaseService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    // Reset static property
    ;(DatabaseService as any).db = null
  })

  describe('init', () => {
    test('should initialize database and create tables', async () => {
      await DatabaseService.init()

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS cleaning_history')
      )
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS settings')
      )
    })

    test('should not initialize database twice', async () => {
      await DatabaseService.init()
      await DatabaseService.init()

      // Should only be called once for each table
      expect(mockDb.execute).toHaveBeenCalledTimes(2)
    })
  })

  describe('addCleaningRecord', () => {
    const mockRecord: Omit<CleaningHistory, 'id' | 'created_at'> = {
      date: '2024-01-01',
      time: '10:00:00',
      space_cleaned: 1024000,
      files_deleted: 50,
      duration: 5000,
      type: 'quick',
      status: 'success',
    }

    test('should add cleaning record successfully', async () => {
      mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

      const result = await DatabaseService.addCleaningRecord(mockRecord)

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO cleaning_history'),
        [
          mockRecord.date,
          mockRecord.time,
          mockRecord.space_cleaned,
          mockRecord.files_deleted,
          mockRecord.duration,
          mockRecord.type,
          mockRecord.status,
          null,
        ]
      )
      expect(result).toBe(1)
    })

    test('should add cleaning record with errors', async () => {
      const recordWithErrors = { ...mockRecord, errors: 'Some error occurred' }
      mockDb.execute.mockResolvedValue({ lastInsertId: 2 })

      await DatabaseService.addCleaningRecord(recordWithErrors)

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO cleaning_history'),
        expect.arrayContaining(['Some error occurred'])
      )
    })
  })

  describe('getCleaningHistory', () => {
    test('should get cleaning history with default limit', async () => {
      const mockHistory: CleaningHistory[] = [
        {
          id: 1,
          date: '2024-01-01',
          time: '10:00:00',
          space_cleaned: 1024000,
          files_deleted: 50,
          duration: 5000,
          type: 'quick',
          status: 'success',
          created_at: '2024-01-01 10:00:00',
        },
      ]
      mockDb.select.mockResolvedValue(mockHistory)

      const result = await DatabaseService.getCleaningHistory()

      expect(mockDb.select).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM cleaning_history'),
        [50]
      )
      expect(result).toEqual(mockHistory)
    })

    test('should get cleaning history with custom limit', async () => {
      mockDb.select.mockResolvedValue([])

      await DatabaseService.getCleaningHistory(10)

      expect(mockDb.select).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        [10]
      )
    })
  })

  describe('getCleaningStats', () => {
    test('should get cleaning stats', async () => {
      const mockStats = [
        {
          total_space_cleaned: 2048000,
          total_files_deleted: 100,
          total_sessions: 5,
          avg_duration: 4500,
        },
      ]
      mockDb.select.mockResolvedValue(mockStats)

      const result = await DatabaseService.getCleaningStats()

      expect(mockDb.select).toHaveBeenCalledWith(
        expect.stringContaining('SUM(space_cleaned) as total_space_cleaned')
      )
      expect(result).toEqual(mockStats[0])
    })

    test('should return default stats when no data', async () => {
      mockDb.select.mockResolvedValue([])

      const result = await DatabaseService.getCleaningStats()

      expect(result).toEqual({
        total_space_cleaned: 0,
        total_files_deleted: 0,
        total_sessions: 0,
        avg_duration: 0,
      })
    })
  })

  describe('deleteCleaningRecord', () => {
    test('should delete cleaning record by id', async () => {
      await DatabaseService.deleteCleaningRecord(1)

      expect(mockDb.execute).toHaveBeenCalledWith(
        'DELETE FROM cleaning_history WHERE id = ?',
        [1]
      )
    })
  })

  describe('clearAllHistory', () => {
    test('should clear all history', async () => {
      await DatabaseService.clearAllHistory()

      expect(mockDb.execute).toHaveBeenCalledWith(
        'DELETE FROM cleaning_history'
      )
    })
  })

  describe('getSetting', () => {
    test('should get setting value', async () => {
      mockDb.select.mockResolvedValue([{ value: 'test_value' }])

      const result = await DatabaseService.getSetting('test_key')

      expect(mockDb.select).toHaveBeenCalledWith(
        'SELECT value FROM settings WHERE key = ?',
        ['test_key']
      )
      expect(result).toBe('test_value')
    })

    test('should return null when setting not found', async () => {
      mockDb.select.mockResolvedValue([])

      const result = await DatabaseService.getSetting('non_existent_key')

      expect(result).toBeNull()
    })
  })

  describe('setSetting', () => {
    test('should set setting value', async () => {
      await DatabaseService.setSetting('test_key', 'test_value')

      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO settings'),
        ['test_key', 'test_value']
      )
    })
  })

  describe('exportHistory', () => {
    test('should export history with large limit', async () => {
      const mockHistory: CleaningHistory[] = []
      mockDb.select.mockResolvedValue(mockHistory)

      const result = await DatabaseService.exportHistory()

      expect(mockDb.select).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        [1000]
      )
      expect(result).toEqual(mockHistory)
    })
  })
})
