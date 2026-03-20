import { FrankfurterError } from "./errors.js";
import type { FrankfurterClientOptions, RequestOptions } from "./types.js";

const DEFAULT_BASE_URL = "https://api.frankfurter.dev";
const DEFAULT_API_PREFIX = "/v2";

export interface ResolvedClientOptions {
  baseUrl: string;
  fetch: typeof fetch;
  timeout: number | undefined;
  headers: HeadersInit | undefined;
}

export function resolveClientOptions(options: FrankfurterClientOptions = {}): ResolvedClientOptions {
  const fetchImpl = options.fetch ?? globalThis.fetch;

  if (!fetchImpl) {
    throw new Error("A fetch implementation is required. Pass one in the client options.");
  }

  return {
    baseUrl: normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL),
    fetch: fetchImpl,
    timeout: options.timeout,
    headers: options.headers
  };
}

export function normalizeBaseUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, "");
  const url = new URL(normalized);

  if (url.pathname === DEFAULT_API_PREFIX || url.pathname.endsWith(`${DEFAULT_API_PREFIX}`)) {
    return url.toString().replace(/\/+$/, "");
  }

  url.pathname = `${url.pathname.replace(/\/+$/, "")}${DEFAULT_API_PREFIX}`;
  return url.toString().replace(/\/+$/, "");
}

export function createUrl(baseUrl: string, path: string, query?: URLSearchParams): string {
  const url = new URL(path, `${baseUrl}/`);

  if (query && Array.from(query.keys()).length > 0) {
    url.search = query.toString();
  }

  return url.toString();
}

export async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

export async function requestJson<T>(
  options: ResolvedClientOptions,
  url: string,
  requestOptions: RequestOptions = {}
): Promise<T> {
  const controller = createTimeoutController(options.timeout, requestOptions.signal);
  const headers = mergeHeaders(options.headers, requestOptions.headers);
  const init: RequestInit = {
    method: "GET",
    signal: controller.signal
  };

  if (headers) {
    init.headers = headers;
  }

  try {
    const response = await options.fetch(url, init);

    const body = await parseResponseBody(response);

    if (!response.ok) {
      throw new FrankfurterError({
        status: response.status,
        statusText: response.statusText,
        url,
        body,
        headers: response.headers
      });
    }

    return body as T;
  } finally {
    controller.cleanup();
  }
}

function mergeHeaders(defaultHeaders?: HeadersInit, requestHeaders?: HeadersInit): Headers | undefined {
  if (!defaultHeaders && !requestHeaders) {
    return undefined;
  }

  const headers = new Headers(defaultHeaders);
  new Headers(requestHeaders).forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
}

function createTimeoutController(timeout: number | undefined, signal?: AbortSignal) {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const abort = () => controller.abort(signal?.reason);

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener("abort", abort, { once: true });
    }
  }

  if (typeof timeout === "number" && timeout > 0 && !controller.signal.aborted) {
    timeoutId = setTimeout(() => {
      controller.abort(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);
  }

  return {
    signal: controller.signal,
    cleanup() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (signal) {
        signal.removeEventListener("abort", abort);
      }
    }
  };
}
