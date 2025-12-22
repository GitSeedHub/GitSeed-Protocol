/**
 * Metrics stub.
 * In production: expose Prometheus metrics and business counters.
 */
export function record(name: string, value = 1, labels?: Record<string, string>) {
  void name;
  void value;
  void labels;
}
