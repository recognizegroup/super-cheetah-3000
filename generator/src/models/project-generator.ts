export interface ProjectGenerator {
  packageLocation: string;
  version: string;
  inputs: Record<string, unknown>;
}
