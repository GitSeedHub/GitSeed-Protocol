export function networkAllowedFlag(allowNetwork: boolean) {
  // Docker uses "--network=none" to disable network.
  return allowNetwork ? [] : ['--network=none'];
}
