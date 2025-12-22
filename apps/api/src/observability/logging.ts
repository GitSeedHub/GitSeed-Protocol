/**
 * Logging helpers.
 */
export function sanitizeError(err: unknown) {
  if (err instanceof Error) return { message: err.message, stack: err.stack };
  return { message: String(err) };
}
