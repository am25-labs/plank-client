import type { PlankCacheOptions, PlankParams } from './types.js'
import { buildPlankUrl } from './url.js'

export function createFetcher(baseUrl: string, token: string) {
  return async function fetchFromPlank<T = unknown>(
    endpoint: string,
    params: PlankParams = {},
    options: PlankCacheOptions = {},
  ): Promise<T> {
    const url = buildPlankUrl(baseUrl, endpoint, params)
    const { cache = 'force-cache', revalidate } = options

    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      headers: { Authorization: `Bearer ${token}` },
    }

    if (typeof revalidate === 'number') {
      fetchOptions.next = { revalidate }
    } else {
      fetchOptions.cache = cache
    }

    const res = await fetch(url, fetchOptions)

    if (!res.ok) {
      throw new Error(`Plank fetch failed: ${res.status} ${res.statusText}`)
    }

    return res.json() as Promise<T>
  }
}
