import * as React from 'react';

export function GitNutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 128 128" fill="none" aria-hidden="true" {...props}>
      <path
        d="M64 10c22 0 44 18 44 42 0 26-18 42-44 64C38 94 20 78 20 52 20 28 42 10 64 10Z"
        stroke="currentColor"
        strokeWidth="8"
      />
      <path
        d="M46 52c8-6 12-14 18-14 8 0 14 10 22 10 6 0 10-4 14-8"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M44 78c10 8 18 10 20 10 2 0 10-2 20-10"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
