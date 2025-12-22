export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestOptions = {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
};

export type HttpResponse<T> = {
  status: number;
  headers: Record<string, string>;
  data: T;
  rawText?: string;
};
