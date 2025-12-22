/**
 * Minimal permission layer.
 * In production you would implement RBAC/ABAC, project maintainers, and policy checks.
 */
export type Permission =
  | "projects:read"
  | "projects:write"
  | "releases:read"
  | "releases:write"
  | "jobs:write"
  | "attestations:read";

export function defaultPermissions() : Permission[] {
  return ["projects:read", "releases:read", "attestations:read", "jobs:write"];
}
