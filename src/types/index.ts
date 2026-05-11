/** Standard API response envelope. */
export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  message: string
}

/** Error-only response shape — data is always null on error. */
export interface ApiError {
  status: 'error'
  data: null
  message: string
}
