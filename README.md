# Plank CMS - Client

Client for the [Plank CMS](https://github.com/plank-cms/plank) headless API. Works with Next.js App Router, Astro, or any React project.

## Installation

```bash
pnpm add @plank-cms/client
```

## Setup

Create a client instance and export it for reuse across your project:

```ts
// lib/plank.ts
import { createPlankClient } from "@plank-cms/client";

const plank = createPlankClient({
  url: process.env.PLANK_URL!,
  token: process.env.PLANK_TOKEN!,
  // optional: attach a default locale to all public API requests when not overridden
  // defaultLocale: 'en',
});

export default plank;
```

```bash
# .env.local
PLANK_URL=https://your-plank-instance.com
PLANK_TOKEN=plank_a1b2c3d4...
```

## Usage

### Collections

Fetch a list of entries from a collection type:

```ts
import plank from "@/lib/plank";

const { data, total, page, limit } = await plank.collection("posts").findMany();
```

With params:

```ts
const { data } = await plank.collection("posts").findMany({
  page: 1,
  limit: 9,
  status: "published",
  // any field defined in your content type works as an equality filter
  category: "news",
});
```

Locale / per-request override:

```ts
// if you configured a `defaultLocale` on the client, you can still override it per-request
const { data: esPosts } = await plank
  .collection("posts")
  .findMany({ locale: "es" });
const { data: frPosts } = await plank
  .collection("posts")
  .findMany({ locale: "fr" });
```

Fetch a single entry by ID:

```ts
const post = await plank.collection("posts").findOne("entry-id");
```

### Single Types

```ts
const homepage = await plank.single("homepage").find();
```

### Drafts

```ts
const draft = await plank
  .collection("posts")
  .findOne("entry-id", { cache: "no-store" });
// or with status
const drafts = await plank
  .collection("posts")
  .findMany({ status: "draft" }, { cache: "no-store" });
```

---

## Next.js App Router cache

The client integrates natively with Next.js `fetch` cache options.

### Static (default)

Data cached indefinitely. Ideal for content that rarely changes.

```ts
await plank.collection("posts").findMany();
// equivalent to fetch(..., { cache: 'force-cache' })
```

### ISR — Incremental Static Regeneration

Revalidate on a time interval:

```ts
// revalidate every 10 minutes
await plank.collection("posts").findMany({}, { revalidate: 600 });

// revalidate every 24 hours
await plank.single("homepage").find({}, { revalidate: 86400 });
```

### No cache

Always fetch fresh data. Useful for previews or highly dynamic content:

```ts
await plank.collection("posts").findMany({}, { cache: "no-store" });
```

---

## TypeScript

The client is fully typed. Pass your content type interface as a generic to get typed responses:

```ts
interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  cover: { url: string };
  published_at: string;
}

const { data } = await plank.collection<Post>("posts").findMany();
// data is Post[]

const post = await plank.collection<Post>("posts").findOne("entry-id");
// post is Post
```

---

## Query params reference

| Param         | Type                              | Default       | Description                                                   |
| ------------- | --------------------------------- | ------------- | ------------------------------------------------------------- |
| `page`        | `number`                          | `1`           | Page number                                                   |
| `limit`       | `number`                          | `20`          | Entries per page (max 100)                                    |
| `status`      | `'published' \| 'draft' \| 'all'` | `'published'` | Filter by status                                              |
| `sort`        | `string`                          | —             | Field name to sort by                                         |
| `order`       | `'asc' \| 'desc'`                 | —             | Sort direction                                                |
| `[fieldname]` | `string \| number`                | —             | Equality filter on any content type field                     |
| `locale`      | `string`                          | —             | Request a localized version of localizable fields (e.g. `es`) |

---

## Low-level API

For full control, use `fetch` and `buildUrl` directly:

```ts
// raw fetch
const data = await plank.fetch("/posts", { limit: 5 }, { revalidate: 300 });

// build URL without fetching (useful for debugging or custom fetch logic)
const url = plank.buildUrl("/posts", { category: "news", limit: 10 });
// https://your-plank-instance.com/api/posts?category=news&limit=10
```

---

## License

[MIT](LICENSE) - AM25, S.A.S. DE C.V.
