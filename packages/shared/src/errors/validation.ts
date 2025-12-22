import { GitNutError } from './base.js';

export class ValidationError extends GitNutError {
  public readonly issues: unknown;

  constructor(message: string, issues?: unknown) {
    super(message, 'VALIDATION_ERROR');
    this.issues = issues;
  }
}
