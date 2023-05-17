import {TemplateEngine} from './template-engine'
import * as nunjucks from 'nunjucks'
import {StringModificationHelper} from '../helpers/string-modification-helper'

export class NunjucksTemplateEngine implements TemplateEngine {
  constructor(private root: string) {}

  async render(template: string, context: { [p: string]: any }): Promise<string> {
    const environment = this.buildEnvironment()

    return environment.renderString(
      template,
      {
        ...context,
      },
    )
  }

  supports(path: string): boolean {
    return path.endsWith('.njs')
  }

  transformFilename(path: string): string {
    return path.replace(/\.njs$/, '')
  }

  buildEnvironment(): nunjucks.Environment {
    const loader = new nunjucks.FileSystemLoader(this.root)
    const environment = new nunjucks.Environment(loader)

    environment.addFilter('pascalCase', StringModificationHelper.toPascalCase.bind(StringModificationHelper))
    environment.addFilter('camelCase', StringModificationHelper.toCamelCase.bind(StringModificationHelper))
    environment.addFilter('kebabCase', StringModificationHelper.toKebabCase.bind(StringModificationHelper))
    environment.addFilter('snakeCase', StringModificationHelper.toSnakeCase.bind(StringModificationHelper))
    environment.addFilter('titleCase', StringModificationHelper.toTitleCase.bind(StringModificationHelper))
    environment.addFilter('sentenceCase', StringModificationHelper.toSentenceCase.bind(StringModificationHelper))
    environment.addFilter('urlCase', StringModificationHelper.toUrlCase.bind(StringModificationHelper))
    environment.addFilter('plural', StringModificationHelper.toPlural.bind(StringModificationHelper))
    environment.addFilter('json', value => JSON.stringify(value, null, 2))

    return environment
  }
}
