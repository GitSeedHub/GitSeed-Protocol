export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function truncateMiddle(s: string, keep = 10) {
  if (s.length <= keep * 2 + 3) return s;
  return `${s.slice(0, keep)}...${s.slice(-keep)}`;
}
