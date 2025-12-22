import { HttpError } from '../errors/http.js';
import type { HttpRequestOptions, HttpResponse } from './types.js';

function headersToObject(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((v, k) => {
    out[k.toLowerCase()] = v;
  });
  return out;
}

export async function httpJson<T>(opts: HttpRequestOptions): Promise<HttpResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 30_000);

  try {
    const res = await fetch(opts.url, {
      method: opts.method,
      headers: {
        'content-type': 'application/json',
        ...(opts.headers ?? {}),
      },
      body: typeof opts.body === 'undefined' ? undefined : JSON.stringify(opts.body),
      signal: controller.signal,
    });

    const text = await res.text();
    const headers = headersToObject(res.headers);

    if (!res.ok) {
      throw new HttpError({
        message: `HTTP ${res.status} ${opts.method} ${opts.url}`,
        status: res.status,
        url: opts.url,
        method: opts.method,
        bodyText: text.slice(0, 8_000),
      });
    }

    const data = (text ? JSON.parse(text) : null) as T;
    return { status: res.status, headers, data, rawText: text };
  } finally {
    clearTimeout(timeout);
  }
}
