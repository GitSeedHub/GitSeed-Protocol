export type EnvName = 'localnet' | 'devnet' | 'testnet' | 'mainnet';

export type RuntimeEnv = {
  env: EnvName;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
};
