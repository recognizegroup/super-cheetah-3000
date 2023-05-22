export interface Loader {
  start(): Promise<void>;
  stop(): Promise<void>;
}
