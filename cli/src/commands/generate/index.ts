import {Command, Flags} from '@oclif/core'

export default class Generate extends Command {
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
    const {args, flags} = await this.parse(Generate)

    this.log(`hello ${args.person} from ${flags.from}! (./src/commands/hello/index.ts)`)
  }
}
