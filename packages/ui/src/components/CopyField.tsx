import * as React from 'react';
import { Button } from './Button.js';
import { cn } from '../utils/cn.js';
import { copyToClipboard } from '../utils/copy.js';

export type CopyFieldProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyField({ value, label, className }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function onCopy() {
    setErr(null);
    try {
      await copyToClipboard(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to copy');
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label ? <div className="text-xs font-medium text-gray-600">{label}</div> : null}
      <div className="flex gap-2">
        <input
          readOnly
          value={value}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono"
        />
        <Button variant="secondary" onClick={onCopy} type="button">
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {err ? <div className="text-xs text-red-600">{err}</div> : null}
    </div>
  );
}
