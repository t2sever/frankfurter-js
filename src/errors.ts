export interface FrankfurterErrorOptions {
  status: number;
  statusText: string;
  url: string;
  body: unknown | undefined;
  headers: Headers | undefined;
}

export class FrankfurterError extends Error {
  readonly name = "FrankfurterError";
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly body: unknown | undefined;
  readonly headers: Headers | undefined;

  constructor(options: FrankfurterErrorOptions) {
    super(`Frankfurter API request failed with ${options.status} ${options.statusText}`);
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
    this.body = options.body;
    this.headers = options.headers;
  }
}
