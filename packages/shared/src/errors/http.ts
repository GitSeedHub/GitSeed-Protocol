import { GitNutError } from './base.js';

export class HttpError extends GitNutError {
  public readonly status: number;
  public readonly url: string;
  public readonly method: string;
  public readonly bodyText?: string;

  constructor(opts: { message: string; status: number; url: string; method: string; bodyText?: string }) {
    super(opts.message, 'HTTP_ERROR');
    this.status = opts.status;
    this.url = opts.url;
    this.method = opts.method;
    this.bodyText = opts.bodyText;
  }
}
