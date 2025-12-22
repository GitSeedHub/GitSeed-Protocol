// Improved rate limiting
import rateLimit from 'express-rate-limit';
export const apiLimiter = rateLimit({windowMs:60_000,max:300});
