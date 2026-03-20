import type { CurrenciesQuery, Listable, RatesQuery } from "./types.js";

export function buildRatesQuery(query: RatesQuery = {}): URLSearchParams {
  const searchParams = new URLSearchParams();

  append(searchParams, "date", query.date);
  append(searchParams, "from", query.from);
  append(searchParams, "to", query.to);
  append(searchParams, "base", query.base);
  appendList(searchParams, "quotes", query.quotes);
  appendList(searchParams, "providers", query.providers);
  append(searchParams, "group", query.group);

  return searchParams;
}

export function buildCurrenciesQuery(query: CurrenciesQuery = {}): URLSearchParams {
  const searchParams = new URLSearchParams();
  append(searchParams, "scope", query.scope);
  return searchParams;
}

function append(searchParams: URLSearchParams, key: string, value: string | undefined) {
  if (typeof value === "string" && value.length > 0) {
    searchParams.set(key, value);
  }
}

function appendList(searchParams: URLSearchParams, key: string, value: Listable<string> | undefined) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > 0) {
      searchParams.set(key, value.join(","));
    }
    return;
  }

  const stringValue = value as string;

  if (stringValue.length > 0) {
    searchParams.set(key, stringValue);
  }
}
