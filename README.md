# frankfurter-js

A lightweight, production-ready TypeScript SDK for the [Frankfurter currency API](https://github.com/lineofflight/frankfurter).

It stays close to the HTTP API, uses `fetch`, ships type declarations, and works in modern Node.js and browsers.

## Install

```bash
npm install frankfurter-js
```

## Quick Start

```ts
import { FrankfurterClient } from "frankfurter-js";

const client = new FrankfurterClient();

const latest = await client.latest({
  base: "USD",
  quotes: ["EUR", "GBP"]
});
```

The default base URL is `https://api.frankfurter.dev`. The client targets the OpenAPI server path at `/v2` internally.

## API

### Create a client

```ts
import { FrankfurterClient, createFrankfurterClient } from "frankfurter-js";

const client = new FrankfurterClient({
  timeout: 5_000
});

const clientFromFactory = createFrankfurterClient();
```

### `rates(query?, requestOptions?)`

Thin mapping to `GET /rates`.

```ts
const rates = await client.rates({
  date: "2025-01-10",
  base: "EUR",
  quotes: ["USD", "CHF"],
  providers: ["ECB"],
});
```

### `latest(options?, requestOptions?)`

Convenience method for the latest rates.

```ts
const latest = await client.latest({
  base: "USD",
  quotes: ["EUR", "GBP"]
});
```

### `historical(date, options?, requestOptions?)`

Convenience method for a specific date.

```ts
const historical = await client.historical("2025-01-10", {
  base: "EUR",
  quotes: "USD"
});
```

### `range(from, to?, options?, requestOptions?)`

Convenience method for date ranges.

```ts
const ranged = await client.range("2025-01-01", "2025-01-31", {
  base: "EUR",
  quotes: ["USD", "CHF"],
  group: "month"
});
```

### `currencies(query?, requestOptions?)`

Maps to `GET /currencies`.

```ts
const currencies = await client.currencies();
const allCurrencies = await client.currencies({ scope: "all" });
```

### `providers(requestOptions?)`

Maps to `GET /providers`.

```ts
const providers = await client.providers();
```

## Self-Hosted Base URL

```ts
import { FrankfurterClient } from "frankfurter-js";

const client = new FrankfurterClient({
  baseUrl: "https://rates.example.com"
});
```

## Custom Fetch

```ts
import { FrankfurterClient } from "frankfurter-js";

const client = new FrankfurterClient({
  fetch: window.fetch.bind(window)
});
```

## Request Timeout and AbortSignal

```ts
const client = new FrankfurterClient({
  timeout: 5_000
});

const controller = new AbortController();

const rates = await client.latest(
  { base: "EUR", quotes: ["USD"] },
  { signal: controller.signal }
);
```

## Error Handling

Non-2xx responses throw `FrankfurterError`.

```ts
import { FrankfurterClient, FrankfurterError } from "frankfurter-js";

const client = new FrankfurterClient();

try {
  await client.historical("invalid-date");
} catch (error) {
  if (error instanceof FrankfurterError) {
    console.error(error.status);
    console.error(error.statusText);
    console.error(error.url);
    console.error(error.body);
  }
}
```

## TypeScript

```ts
import type { Currency, Provider, Rate } from "frankfurter-js";
import { FrankfurterClient } from "frankfurter-js";

const client = new FrankfurterClient();

const rates: Rate[] = await client.latest({ base: "EUR", quotes: ["USD"] });
const currencies: Currency[] = await client.currencies();
const providers: Provider[] = await client.providers();
```

## Notes

- `quotes` and `providers` accept either a comma-separated string or a string array.
- Query serialization follows the OpenAPI contract and sends comma-separated values for list params.
- The SDK intentionally does not add retries, caching, or response reshaping.

## Development

```bash
npm install
npm run build
npm test
```
