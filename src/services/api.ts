import type { ApiError, ApiResponse } from '@/types'

const REQUEST_TIMEOUT_MS = 10_000

/**
 * Generic fetch wrapper that reads VITE_API_BASE_URL from the environment,
 * enforces a 10-second timeout via AbortController, and returns a typed
 * ApiResponse<T> on success or ApiError on failure.
 */
export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T> | ApiError> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new Error(
      'VITE_API_BASE_URL is not set. Add it to your .env.local file before calling fetchApi.'
    )
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
    })

    const json = (await response.json()) as ApiResponse<T>

    if (!response.ok) {
      return {
        status: 'error',
        data: null,
        message: json.message || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    return json
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        status: 'error',
        data: null,
        message: `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
      }
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { status: 'error', data: null, message }
  } finally {
    clearTimeout(timeoutId)
  }
}
