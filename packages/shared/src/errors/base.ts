export class GitNutError extends Error {
  public readonly name = 'GitNutError';
  public readonly code: string;
  public readonly cause?: unknown;

  constructor(message: string, code = 'GITNUT_ERROR', cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}

export function isGitNutError(e: unknown): e is GitNutError {
  return typeof e === 'object' && e !== null && (e as any).code && (e as any).name === 'GitNutError';
}
