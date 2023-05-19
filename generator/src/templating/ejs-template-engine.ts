import {TemplateEngine} from './template-engine'
import * as ejs from 'ejs'
import {StringModificationHelper} from '../helpers/string-modification-helper'
import {EntityFieldHelper} from '../helpers/entity-field-helper'

export class EjsTemplateEngine implements TemplateEngine {
  constructor(private root: string) {}

  async render(template: string, context: { [key: string]: any }): Promise<string> {
    return ejs.render(
      template,
      {
        ...context,
        ...this.constructHelperFunctions(),
      },
      {root: this.root},
    )
  }

  supports(path: string): boolean {
    return path.endsWith('.ejs')
  }

  transformFilename(path: string): string {
    return path.replace(/\.ejs$/, '')
  }

  private constructHelperFunctions() {
    return {
      toPascalCase: StringModificationHelper.toPascalCase,
      toCamelCase: StringModificationHelper.toCamelCase,
      toKebabCase: StringModificationHelper.toKebabCase,
      toSnakeCase: StringModificationHelper.toSnakeCase,
      toTitleCase: StringModificationHelper.toTitleCase,
      toSentenceCase: StringModificationHelper.toSentenceCase,
      toUrlCase: StringModificationHelper.toUrlCase,
      toPlural: StringModificationHelper.toPlural,
      flattenEntityFieldsForTestResults: EntityFieldHelper.flattenEntityFieldsForTestResults,
      findRelatedEntities: EntityFieldHelper.findRelatedEntities,
    }
  }
}
