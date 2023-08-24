import {TemplateEngine} from './template-engine'
import * as nunjucks from 'nunjucks'
import {StringModificationHelper} from '../helpers/string-modification-helper'
import {EntityFieldHelper} from '../helpers/entity-field-helper'
import {IncrementalDataHandler} from './incremental-data-handler'
import {Entity} from '../models/entity'
import {ParseError} from '../error/parse-error'
import {TemplateInfo} from '../models/template-info'

export class NunjucksTemplateEngine implements TemplateEngine {
  private environment: nunjucks.Environment = this.buildEnvironment()

  constructor(private root: string = '') {}

  async setup(generatorName: string, incrementalDataHandler: IncrementalDataHandler) {
    this.environment = this.buildEnvironment(generatorName, incrementalDataHandler)
  }

  render(template: string, context: { [p: string]: any }, outputFile?: string, info?: TemplateInfo): Promise<string> {
    return new Promise((resolve, reject) => {
      this.environment.renderString(
        template,
        {
          ...context,
          outputFile,
        },
        (error, result) => {
          if (error) {
            reject(this.transformError(error, info, outputFile ? undefined : template))
          } else {
            resolve(result ?? '')
          }
        },
      )
    })
  }

  supports(path: string): boolean {
    return path.endsWith('.njk')
  }

  transformFilename(path: string): string {
    return path.replace(/\.njk$/, '')
  }

  buildEnvironment(generatorName?: string, incrementalDataHandler?: IncrementalDataHandler): nunjucks.Environment {
    const loader = new nunjucks.FileSystemLoader(this.root)
    const environment = new nunjucks.Environment(loader)

    environment.addFilter('pascalCase', StringModificationHelper.toPascalCase.bind(StringModificationHelper))
    environment.addFilter('camelCase', StringModificationHelper.toCamelCase.bind(StringModificationHelper))
    environment.addFilter('kebabCase', StringModificationHelper.toKebabCase.bind(StringModificationHelper))
    environment.addFilter('snakeCase', StringModificationHelper.toSnakeCase.bind(StringModificationHelper))
    environment.addFilter('titleCase', StringModificationHelper.toTitleCase.bind(StringModificationHelper))
    environment.addFilter('sentenceCase', StringModificationHelper.toSentenceCase.bind(StringModificationHelper))
    environment.addFilter('urlCase', StringModificationHelper.toUrlCase.bind(StringModificationHelper))
    environment.addFilter('constantCase', StringModificationHelper.toConstantCase.bind(StringModificationHelper))
    environment.addFilter('plural', StringModificationHelper.toPlural.bind(StringModificationHelper))
    environment.addFilter('json', value => JSON.stringify(value, null, 2))
    environment.addFilter('concat', (value, second) => [...value, ...second])
    environment.addFilter('mainProperty', (entity: Entity) => EntityFieldHelper.mainProperty(entity))
    environment.addFilter('flattenEntityFieldsForTestResults', EntityFieldHelper.flattenEntityFieldsForTestResults.bind(EntityFieldHelper))
    environment.addFilter('findRelatedEntities', EntityFieldHelper.findRelatedEntities.bind(EntityFieldHelper))
    environment.addExtension('incremental', {
      tags: ['incremental'],
      parse(parser: any, nodes: any) {
        const token = parser.nextToken()
        const args = parser.parseSignature(null, true)
        parser.advanceAfterBlockEnd(token.value)

        const tagName = 'incremental'
        const endTagName = 'endincremental'

        // The following code is coming from the nunjucks source code
        const rawBlockRegex = new RegExp('([\\s\\S]*?){%\\s*(' + tagName + '|' + endTagName + ')\\s*(?=%})%}')

        let rawLevel = 1
        let str = ''
        let matches = null

        while ((matches = parser.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
          const all = matches[0] as string
          const pre = matches[1] as string
          const blockName = matches[2]

          if (blockName === tagName) {
            rawLevel += 1
          } else if (blockName === endTagName) {
            rawLevel -= 1
          }

          if (rawLevel === 0) {
            str += pre
            parser.tokens.backN(all.length - pre.length)
          } else {
            str += all
          }
        }

        const argId = args.children[0]?.children[0]?.value?.value

        this.body = this.body ?? {}
        this.body[argId] = str.trim()

        return new nodes.CallExtensionAsync(this, 'run', args, [])
      },
      async run({ctx}: any, {id, lang: markerLanguage}, callback) {
        const marker = await incrementalDataHandler?.registerDataPiece(id, this.body[id], ctx.outputFile, markerLanguage ?? 'html', generatorName)

        callback(null, new nunjucks.runtime.SafeString(marker ?? ''))
      },
    } as any)

    return environment
  }

  transformError(error: Error, info?: TemplateInfo, template?: string): Error {
    // This function attempts to transform the error into a more readable error, with correct line numbers.
    // Although it is possible that the message changes in the future, it is still better than the default error message.
    const asString = error.toString()
    const path = info?.path

    if (asString.includes('Template render error')) {
      const matches = asString.match(/Template render error: \(unknown path\) \[Line (\d+), Column (\d+)]/)
      const line = Number(matches?.[1] ?? 0) + (info?.lineOffset ?? 0)
      const column = Number(matches?.[2] ?? 0)
      const message = asString.split('\n')[1].trim()

      return new ParseError(path ?? 'unknown', line, column, message, template)
    }

    return error
  }
}
