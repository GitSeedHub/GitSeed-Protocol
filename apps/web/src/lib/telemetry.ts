/**
 * Frontend telemetry stub.
 * In production: send events to your observability stack.
 */
export type TelemetryEvent =
  | { type: "page_view"; path: string }
  | { type: "cta_click"; id: string }
  | { type: "verify_attempt"; releaseId?: string };

export function track(evt: TelemetryEvent) {
  if (process.env.NEXT_PUBLIC_TELEMETRY !== "1") return;
  // eslint-disable-next-line no-console
  console.log("[telemetry]", evt);
}
