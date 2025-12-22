export type Subscriber = {
  start(): Promise<void>;
  stop(): Promise<void>;
};
