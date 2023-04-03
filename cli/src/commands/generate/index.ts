import {Flags} from '@oclif/core'
import {BaseCommand} from '../base'

export default class Generate extends BaseCommand {
  static description = 'Generate all project files according to the current project model.'

  static examples = [
    `$ oex generate

$ oex generate --force
`,
  ]

  static flags = {
    force: Flags.string({char: 'f', description: 'Overwrite any existing files during the generation process.', required: false}),
  }

  async run(): Promise<void> {
    this.log('hello world')
  }
}
