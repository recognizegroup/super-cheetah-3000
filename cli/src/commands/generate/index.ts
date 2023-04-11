import {Flags} from '@oclif/core'
import {BaseCommand} from '../base'
import {
  DataType,
  EjsTemplateEngine, Entity, EntityContext,
  FakerTestDataManager,
  Generator, LocalFilesystem,
  Project, ProjectContext,
} from '@recognizebv/sc3000-generator'

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
    await this.ensureAuthenticated()

    const library = '@recognizebv/sc3000-kotlin-spring-backend-generator'
    const {default: Generator} = await import(library)
    const generatorInstance: Generator = new Generator()

    const path = '/Users/b.wesselink/Projects/super-cheetah-3000/sample-project'

    const project: Project = {
      client: 'recognize',
      name: 'bezoekersapp',
      team: 'team-technology',
    }

    const {projectCodeProvider, entityCodeProvider, metaData} = generatorInstance
    const testData = new FakerTestDataManager()
    const filesystem = new LocalFilesystem(path)
    const templateEngine = new EjsTemplateEngine(metaData.templateRoot)

    const context = new ProjectContext({
      project,
      filesystem,
      templateEngine,
      testData,
    })

    await projectCodeProvider?.render(context)

    const entity: Entity = {
      name: 'Project',
      operations: {
        read: false,
      },
      fields: [
        {
          name: 'projectId',
          required: true,
          type: DataType.string,
        },
        {
          name: 'title',
          required: true,
          type: DataType.string,
        },
        {
          name: 'size',
          required: true,
          type: DataType.integer,
        },
        {
          name: 'description',
          required: true,
          type: DataType.text,
        },
      ],
    }

    const entityContext = new EntityContext({
      project,
      filesystem,
      templateEngine,
      testData,
      entity,
    })

    try {
      await entityCodeProvider?.render(entityContext)

      this.log('Finished')
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = `Something went wrong while invoking the ${generatorInstance!.metaData.name} generator.\n\n${error.message}`
        throw new Error(message)
      }

      throw error
    }
  }
}
