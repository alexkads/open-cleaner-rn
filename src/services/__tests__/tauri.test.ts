import { formatBytes, formatDuration } from '../tauri';

describe('Tauri Service Utils', () => {
  describe('formatBytes', () => {
    test('should format 0 bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    test('should format bytes correctly', () => {
      expect(formatBytes(500)).toBe('500 Bytes');
    });

    test('should format kilobytes correctly', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });

    test('should format megabytes correctly', () => {
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    test('should format gigabytes correctly', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatBytes(1024 * 1024 * 1024 * 1.25)).toBe('1.25 GB');
    });

    test('should format terabytes correctly', () => {
      expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });

    test('should handle decimal precision correctly', () => {
      expect(formatBytes(1234567)).toBe('1.18 MB');
    });
  });

  describe('formatDuration', () => {
    test('should format seconds correctly', () => {
      expect(formatDuration(5000)).toBe('5s');
      expect(formatDuration(30000)).toBe('30s');
    });

    test('should format minutes correctly', () => {
      expect(formatDuration(60000)).toBe('1m 0s');
      expect(formatDuration(90000)).toBe('1m 30s');
      expect(formatDuration(120000)).toBe('2m 0s');
    });

    test('should format hours correctly', () => {
      expect(formatDuration(3600000)).toBe('1h 0m 0s');
      expect(formatDuration(3690000)).toBe('1h 1m 30s');
    });

    test('should handle milliseconds less than a second', () => {
      expect(formatDuration(500)).toBe('0s');
      expect(formatDuration(999)).toBe('0s');
    });

    test('should handle complex durations', () => {
      expect(formatDuration(7323000)).toBe('2h 2m 3s');
    });
  });
}); 