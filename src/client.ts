import type {
  PlankCacheOptions,
  PlankClient,
  PlankClientConfig,
  PlankListResponse,
  PlankParams,
} from "./types.js";
import { createFetcher } from "./fetcher.js";
import { buildPlankUrl } from "./url.js";

export function createPlankClient({
  url,
  token,
  defaultLocale,
}: PlankClientConfig): PlankClient {
  if (!url) throw new Error("plank-react-client: `url` is required");
  if (!token) throw new Error("plank-react-client: `token` is required");

  const fetcher = createFetcher(url, token, defaultLocale);

  return {
    collection<T = unknown>(slug: string) {
      return {
        findMany(params?: PlankParams, options?: PlankCacheOptions) {
          return fetcher<PlankListResponse<T>>(`/${slug}`, params, options);
        },
        findOne(
          id: string,
          params?: Pick<PlankParams, "status" | "locale" | "fallback">,
          options?: PlankCacheOptions,
        ) {
          return fetcher<T>(`/${slug}/${id}`, params ?? {}, options);
        },
      };
    },

    single<T = unknown>(slug: string) {
      return {
        find(
          params?: Pick<PlankParams, "status">,
          options?: PlankCacheOptions,
        ) {
          return fetcher<T>(`/${slug}`, params, options);
        },
      };
    },

    fetch: fetcher,

    buildUrl(endpoint: string, params?: PlankParams) {
      return buildPlankUrl(url, endpoint, params);
    },
  };
}
