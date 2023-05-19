import {IncrementalDataHandler} from './incremental-data-handler'

export interface TemplateEngine {
  setup(incrementalDataHandler: IncrementalDataHandler): Promise<void>;
  render(template: string, context: { [key: string]: any }, outputFile?: string): Promise<string>;
  supports(path: string): boolean;
  transformFilename(path: string): string;
}
