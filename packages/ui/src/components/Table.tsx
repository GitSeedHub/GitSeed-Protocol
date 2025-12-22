import * as React from 'react';
import { cn } from '../utils/cn.js';

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table {...props} className={cn('w-full text-sm', props.className)} />;
}

export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cn('text-left text-gray-500', props.className)} />;
}

export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cn('divide-y divide-gray-100', props.className)} />;
}

export function TR(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} className={cn('hover:bg-gray-50', props.className)} />;
}

export function TH(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={cn('px-3 py-2 font-medium', props.className)} />;
}

export function TD(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn('px-3 py-2 align-middle', props.className)} />;
}
