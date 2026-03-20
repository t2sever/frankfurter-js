import { describe, expect, it, vi } from "vitest";

import { FrankfurterClient, FrankfurterError } from "../src/index.js";

function createJsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    statusText: init.statusText ?? "OK",
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

describe("FrankfurterClient", () => {
  it("fetches successful responses", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      createJsonResponse([{ date: "2025-01-10", base: "EUR", quote: "USD", rate: 1.03 }])
    );

    const client = new FrankfurterClient({ fetch: fetchMock });
    const result = await client.latest({ base: "EUR", quotes: ["USD"] });

    expect(result).toEqual([{ date: "2025-01-10", base: "EUR", quote: "USD", rate: 1.03 }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("serializes array query params as comma-separated values", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(createJsonResponse([]));
    const client = new FrankfurterClient({ fetch: fetchMock });

    await client.range("2025-01-01", "2025-01-31", {
      base: "EUR",
      quotes: ["USD", "CHF"],
      providers: ["ECB", "BOC"],
      group: "month"
    });

    const [url] = fetchMock.mock.calls[0]!;
    expect(url).toBe(
      "https://api.frankfurter.dev/v2/rates?from=2025-01-01&to=2025-01-31&base=EUR&quotes=USD%2CCHF&providers=ECB%2CBOC&group=month"
    );
  });

  it("throws FrankfurterError for non-2xx responses", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      createJsonResponse({ message: "Invalid request" }, { status: 422, statusText: "Unprocessable Entity" })
    );

    const client = new FrankfurterClient({ fetch: fetchMock });

    await expect(client.historical("bad-date")).rejects.toMatchObject({
      name: "FrankfurterError",
      status: 422,
      statusText: "Unprocessable Entity",
      body: { message: "Invalid request" }
    });
  });

  it("supports a configurable base URL", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(createJsonResponse([]));
    const client = new FrankfurterClient({
      baseUrl: "https://self-hosted.example.test/custom/v2/",
      fetch: fetchMock
    });

    await client.providers();

    const [url] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://self-hosted.example.test/custom/v2/providers");
  });

  it("supports custom fetch injection", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(createJsonResponse([]));
    const client = new FrankfurterClient({ fetch: fetchMock });

    await client.currencies({ scope: "all" });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.frankfurter.dev/v2/currencies?scope=all");
  });

  it("aborts requests when the timeout is exceeded", async () => {
    const fetchMock = vi.fn<typeof fetch>((_input, init) => {
      const signal = init?.signal;

      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener("abort", () => {
          reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const client = new FrankfurterClient({ fetch: fetchMock, timeout: 10 });

    await expect(client.latest()).rejects.toBeInstanceOf(Error);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
