import * as React from 'react';

export function SolanaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
      <path
        d="M64 64h160l-32 32H32l32-32Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinejoin="round"
      />
      <path
        d="M64 112h160l-32 32H32l32-32Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinejoin="round"
      />
      <path
        d="M64 160h160l-32 32H32l32-32Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinejoin="round"
      />
    </svg>
  );
}
