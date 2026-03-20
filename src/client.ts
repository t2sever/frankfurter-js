import { createUrl, requestJson, resolveClientOptions } from "./http.js";
import { buildCurrenciesQuery, buildRatesQuery } from "./query.js";
import type {
  CurrenciesQuery,
  Currency,
  FrankfurterClientOptions,
  HistoricalRatesOptions,
  LatestRatesOptions,
  Provider,
  RangeRatesOptions,
  Rate,
  RatesQuery,
  RequestOptions
} from "./types.js";

/**
 * Thin API client for the Frankfurter currency API.
 */
export class FrankfurterClient {
  private readonly options;

  constructor(options: FrankfurterClientOptions = {}) {
    this.options = resolveClientOptions(options);
  }

  /**
   * Fetch exchange rates using the raw `/rates` query shape from the API.
   */
  async rates(query: RatesQuery = {}, requestOptions: RequestOptions = {}): Promise<Rate[]> {
    const url = createUrl(this.options.baseUrl, "rates", buildRatesQuery(query));
    return requestJson<Rate[]>(this.options, url, requestOptions);
  }

  /**
   * Fetch the latest exchange rates.
   */
  async latest(options: LatestRatesOptions = {}, requestOptions: RequestOptions = {}): Promise<Rate[]> {
    return this.rates(options, requestOptions);
  }

  /**
   * Fetch exchange rates for a specific date.
   */
  async historical(
    date: string,
    options: HistoricalRatesOptions = {},
    requestOptions: RequestOptions = {}
  ): Promise<Rate[]> {
    return this.rates({ ...options, date }, requestOptions);
  }

  /**
   * Fetch exchange rates across a date range.
   */
  async range(
    from: string,
    to?: string,
    options: RangeRatesOptions = {},
    requestOptions: RequestOptions = {}
  ): Promise<Rate[]> {
    return this.rates(
      {
        ...options,
        from,
        ...(to ? { to } : {})
      },
      requestOptions
    );
  }

  /**
   * Fetch available currencies.
   */
  async currencies(query: CurrenciesQuery = {}, requestOptions: RequestOptions = {}): Promise<Currency[]> {
    const url = createUrl(this.options.baseUrl, "currencies", buildCurrenciesQuery(query));
    return requestJson<Currency[]>(this.options, url, requestOptions);
  }

  /**
   * Fetch available data providers.
   */
  async providers(requestOptions: RequestOptions = {}): Promise<Provider[]> {
    const url = createUrl(this.options.baseUrl, "providers");
    return requestJson<Provider[]>(this.options, url, requestOptions);
  }
}

export function createFrankfurterClient(options: FrankfurterClientOptions = {}): FrankfurterClient {
  return new FrankfurterClient(options);
}
