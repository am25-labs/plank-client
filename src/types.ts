export type PlankStatus = 'published' | 'draft' | 'all'

export interface PlankParams {
  page?: number
  limit?: number
  status?: PlankStatus
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface PlankCacheOptions {
  cache?: 'force-cache' | 'no-store'
  revalidate?: number
}

export interface PlankListResponse<T = unknown> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface CollectionClient<T = unknown> {
  findMany(params?: PlankParams, options?: PlankCacheOptions): Promise<PlankListResponse<T>>
  findOne(id: string, options?: PlankCacheOptions): Promise<T>
}

export interface SingleClient<T = unknown> {
  find(params?: Pick<PlankParams, 'status'>, options?: PlankCacheOptions): Promise<T>
}

export interface PlankClient {
  collection<T = unknown>(slug: string): CollectionClient<T>
  single<T = unknown>(slug: string): SingleClient<T>
  fetch<T = unknown>(endpoint: string, params?: PlankParams, options?: PlankCacheOptions): Promise<T>
  buildUrl(endpoint: string, params?: PlankParams): string
}

export interface PlankClientConfig {
  url: string
  token: string
}
