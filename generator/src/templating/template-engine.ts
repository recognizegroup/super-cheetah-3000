import {IncrementalDataHandler} from './incremental-data-handler'
import {TemplateInfo} from '../models/template-info'

export interface TemplateEngine {
  setup(generatorName: string, incrementalDataHandler: IncrementalDataHandler): Promise<void>;
  render(template: string, context: { [key: string]: any }, outputFile?: string, info?: TemplateInfo): Promise<string>;
  supports(path: string): boolean;
  transformFilename(path: string): string;
}
