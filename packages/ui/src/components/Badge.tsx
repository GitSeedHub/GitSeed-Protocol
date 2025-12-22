import * as React from 'react';
import { cn } from '../utils/cn.js';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
};

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-900',
  danger: 'bg-red-100 text-red-800',
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', tones[tone], className)}
    />
  );
}
