/**
 * Tracing stub.
 * In production: initialize OpenTelemetry SDK and exporters.
 */
export function trace<T>(name: string, fn: () => Promise<T>) {
  void name;
  return fn();
}
