import { z } from 'zod';

export const LicensePolicy = z.object({
  allowUnknown: z.boolean().default(false),
  allowedSpdx: z.array(z.string()).default(['MIT', 'Apache-2.0', 'BSD']),
});

export type LicensePolicy = z.infer<typeof LicensePolicy>;

export function evaluateLicense(policy: LicensePolicy, spdxLike?: string) {
  if (!spdxLike) return policy.allowUnknown;
  return policy.allowedSpdx.includes(spdxLike);
}
