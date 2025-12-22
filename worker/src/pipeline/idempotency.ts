// Idempotency keys and guards
import crypto from 'crypto';
export function makeKey(input:object){return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex')}
