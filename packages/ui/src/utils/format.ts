export function shortPk(pk: string, chars = 4): string {
  if (!pk) return '';
  if (pk.length <= chars * 2 + 3) return pk;
  return `${pk.slice(0, chars)}...${pk.slice(-chars)}`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let n = Math.max(0, bytes);
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  const digits = u === 0 ? 0 : 2;
  return `${n.toFixed(digits)} ${units[u]}`;
}

export function formatIsoDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
