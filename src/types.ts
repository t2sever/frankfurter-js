export type DateString = string;
export type CurrencyCode = string;
export type ProviderKey = string;

export interface Rate {
  date: DateString;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
}

export interface Currency {
  iso_code: CurrencyCode;
  iso_numeric?: string | null;
  name: string;
  symbol?: string | null;
  start_date?: DateString | null;
  end_date?: DateString | null;
}

export interface Provider {
  key: ProviderKey;
  name: string;
  base: CurrencyCode;
  start_date?: DateString | null;
  end_date?: DateString | null;
  currencies: CurrencyCode[];
}

export interface ErrorResponseBody {
  message?: string;
  [key: string]: unknown;
}

export type Listable<T> = T | readonly T[];
export type GroupBy = "week" | "month";
export type CurrencyScope = "all";

export interface RatesQuery {
  date?: DateString;
  from?: DateString;
  to?: DateString;
  base?: CurrencyCode;
  quotes?: Listable<CurrencyCode>;
  providers?: Listable<ProviderKey>;
  group?: GroupBy;
}

export interface LatestRatesOptions {
  base?: CurrencyCode;
  quotes?: Listable<CurrencyCode>;
  providers?: Listable<ProviderKey>;
}

export interface HistoricalRatesOptions {
  base?: CurrencyCode;
  quotes?: Listable<CurrencyCode>;
  providers?: Listable<ProviderKey>;
}

export interface RangeRatesOptions {
  base?: CurrencyCode;
  quotes?: Listable<CurrencyCode>;
  providers?: Listable<ProviderKey>;
  group?: GroupBy;
}

export interface CurrenciesQuery {
  scope?: CurrencyScope;
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface FrankfurterClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeout?: number;
  headers?: HeadersInit;
}
