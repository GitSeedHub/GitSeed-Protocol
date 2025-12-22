import * as React from 'react';
import { cn } from '../utils/cn.js';

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('rounded-2xl border border-gray-200 bg-white shadow-sm', props.className)} />;
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-5 border-b border-gray-200', props.className)} />;
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-5', props.className)} />;
}

export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-5 border-t border-gray-200', props.className)} />;
}
