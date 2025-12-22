import pino from 'pino';

export function createLogger(opts: { name: string }) {
  const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
  return pino({
    name: opts.name,
    level,
    base: { service: opts.name },
    redact: {
      paths: [
        'req.headers.authorization',
        'env.GITNUT_API_TOKEN',
        'env.S3_SECRET_ACCESS_KEY',
        'env.R2_SECRET_ACCESS_KEY',
      ],
      remove: true,
    },
  });
}
