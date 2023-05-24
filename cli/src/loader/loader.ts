export interface Loader {
  start(): Promise<void>;
  update(status: string): Promise<void>;
  stop(): Promise<void>;
}
