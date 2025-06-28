import { describe, expect, test } from 'vitest'

// Utility functions for validation
export const isValidCleaningType = (
  type: string
): type is 'quick' | 'deep' | 'custom' => {
  return ['quick', 'deep', 'custom'].includes(type)
}

export const isValidStatus = (
  status: string
): status is 'success' | 'warning' | 'error' => {
  return ['success', 'warning', 'error'].includes(status)
}

export const validateFilePath = (path: string): boolean => {
  if (!path || typeof path !== 'string') return false
  if (path.length === 0) return false
  // Basic path validation - should not contain null bytes
  if (path.includes('\0')) return false
  return true
}

export const calculateSpacePercentage = (
  spaceFreed: number,
  totalSpace: number
): number => {
  if (totalSpace <= 0) return 0
  if (spaceFreed < 0) return 0
  if (spaceFreed > totalSpace) return 100
  return Math.round((spaceFreed / totalSpace) * 100)
}

export const sanitizeErrorMessage = (error: string): string => {
  if (!error || typeof error !== 'string') return 'Unknown error'
  // Remove potential sensitive information
  return error
    .replace(/\/Users\/[^\/\s]+/g, '/Users/***')
    .replace(/\/home\/[^\/\s]+/g, '/home/***')
    .substring(0, 500) // Limit length
}

describe('Validation Utils', () => {
  describe('isValidCleaningType', () => {
    test('should validate correct cleaning types', () => {
      expect(isValidCleaningType('quick')).toBe(true)
      expect(isValidCleaningType('deep')).toBe(true)
      expect(isValidCleaningType('custom')).toBe(true)
    })

    test('should reject invalid cleaning types', () => {
      expect(isValidCleaningType('invalid')).toBe(false)
      expect(isValidCleaningType('')).toBe(false)
      expect(isValidCleaningType('QUICK')).toBe(false)
      expect(isValidCleaningType('full')).toBe(false)
    })
  })

  describe('isValidStatus', () => {
    test('should validate correct status values', () => {
      expect(isValidStatus('success')).toBe(true)
      expect(isValidStatus('warning')).toBe(true)
      expect(isValidStatus('error')).toBe(true)
    })

    test('should reject invalid status values', () => {
      expect(isValidStatus('invalid')).toBe(false)
      expect(isValidStatus('')).toBe(false)
      expect(isValidStatus('SUCCESS')).toBe(false)
      expect(isValidStatus('failed')).toBe(false)
    })
  })

  describe('validateFilePath', () => {
    test('should validate correct file paths', () => {
      expect(validateFilePath('/path/to/file')).toBe(true)
      expect(validateFilePath('./relative/path')).toBe(true)
      expect(validateFilePath('../parent/path')).toBe(true)
      expect(validateFilePath('C:\\Windows\\path')).toBe(true)
    })

    test('should reject invalid file paths', () => {
      expect(validateFilePath('')).toBe(false)
      expect(validateFilePath('\0')).toBe(false)
      expect(validateFilePath('path\0with\0null')).toBe(false)
    })

    test('should handle non-string inputs', () => {
      expect(validateFilePath(null as any)).toBe(false)
      expect(validateFilePath(undefined as any)).toBe(false)
      expect(validateFilePath(123 as any)).toBe(false)
      expect(validateFilePath({} as any)).toBe(false)
    })
  })

  describe('calculateSpacePercentage', () => {
    test('should calculate correct percentages', () => {
      expect(calculateSpacePercentage(500, 1000)).toBe(50)
      expect(calculateSpacePercentage(250, 1000)).toBe(25)
      expect(calculateSpacePercentage(1000, 1000)).toBe(100)
      expect(calculateSpacePercentage(0, 1000)).toBe(0)
    })

    test('should handle edge cases', () => {
      expect(calculateSpacePercentage(1000, 0)).toBe(0)
      expect(calculateSpacePercentage(-100, 1000)).toBe(0)
      expect(calculateSpacePercentage(1500, 1000)).toBe(100)
    })

    test('should round to nearest integer', () => {
      expect(calculateSpacePercentage(333, 1000)).toBe(33)
      expect(calculateSpacePercentage(666, 1000)).toBe(67)
      expect(calculateSpacePercentage(1, 3)).toBe(33)
    })
  })

  describe('sanitizeErrorMessage', () => {
    test('should sanitize user paths', () => {
      const error = 'Error in /Users/john/project/file.js'
      expect(sanitizeErrorMessage(error)).toBe(
        'Error in /Users/***/project/file.js'
      )
    })

    test('should sanitize home paths', () => {
      const error = 'Error in /home/jane/project/file.js'
      expect(sanitizeErrorMessage(error)).toBe(
        'Error in /home/***/project/file.js'
      )
    })

    test('should handle multiple paths', () => {
      const error = 'Error copying from /Users/john/src to /Users/jane/dst'
      expect(sanitizeErrorMessage(error)).toBe(
        'Error copying from /Users/***/src to /Users/***/dst'
      )
    })

    test('should limit message length', () => {
      const longError = 'A'.repeat(600)
      expect(sanitizeErrorMessage(longError)).toHaveLength(500)
    })

    test('should handle invalid inputs', () => {
      expect(sanitizeErrorMessage('')).toBe('Unknown error')
      expect(sanitizeErrorMessage(null as any)).toBe('Unknown error')
      expect(sanitizeErrorMessage(undefined as any)).toBe('Unknown error')
      expect(sanitizeErrorMessage(123 as any)).toBe('Unknown error')
    })
  })
})
