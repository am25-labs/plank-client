import type { PlankParams } from './types.js'

export function buildPlankUrl(baseUrl: string, endpoint: string, params: PlankParams = {}): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  const queryString = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
  return `${baseUrl}/api${endpoint}${queryString ? `?${queryString}` : ''}`
}
