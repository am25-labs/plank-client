import type { PlankParams } from './types.js'

function appendParam(
  params: URLSearchParams,
  key: string,
  value: unknown,
): void {
  if (value === undefined || value === null) return

  if (Array.isArray(value)) {
    if (value.length === 0) return
    params.append(key, value.map((item) => String(item)).join(','))
    return
  }

  if (typeof value === 'object') {
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      appendParam(params, `${key}[${nestedKey}]`, nestedValue)
    }
    return
  }

  params.append(key, String(value))
}

export function buildPlankUrl(baseUrl: string, endpoint: string, params: PlankParams = {}): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    appendParam(query, key, value)
  }
  const queryString = query.toString()
  return `${baseUrl}/api${endpoint}${queryString ? `?${queryString}` : ''}`
}
