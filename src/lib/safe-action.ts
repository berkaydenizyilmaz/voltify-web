// next-safe-action base client

import { createSafeActionClient } from 'next-safe-action'

// Custom error class
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR'
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Base client with error handling
const baseClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof AppError) {
      return error.message
    }

    // Log unexpected errors
    console.error('Server action error:', error)
    return 'Bir hata oluştu'
  },
})

// Public action - no auth required
export const publicAction = baseClient
