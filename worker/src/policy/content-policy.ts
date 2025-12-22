import fs from 'node:fs';
import path from 'node:path';

export type ContentPolicy = {
  forbiddenGlobs: string[];
  forbiddenPatterns: RegExp[];
};

export const DEFAULT_CONTENT_POLICY: ContentPolicy = {
  forbiddenGlobs: ['**/.env', '**/id_rsa', '**/*.pem', '**/*.key'],
  forbiddenPatterns: [
    /BEGIN\s+PRIVATE\s+KEY/i,
    /AWS_SECRET_ACCESS_KEY/i,
    /PRIVATE_KEY/i,
  ],
};

export function scanForForbiddenContent(projectDir: string, policy: ContentPolicy = DEFAULT_CONTENT_POLICY) {
  const hits: { file: string; reason: string }[] = [];

  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === '.git' || e.name === 'node_modules' || e.name === 'target') continue;
        walk(p);
      } else {
        const rel = path.relative(projectDir, p);
        const buf = fs.readFileSync(p);
        const txt = buf.toString('utf-8');
        for (const re of policy.forbiddenPatterns) {
          if (re.test(txt)) hits.push({ file: rel, reason: `pattern:${re.source}` });
        }
      }
    }
  };

  walk(projectDir);
  return hits;
}
