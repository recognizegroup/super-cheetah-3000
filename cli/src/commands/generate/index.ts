import {Flags} from '@oclif/core'
import {BaseCommand} from '../base'
import {
  EjsTemplateEngine, EntityContext,
  FakerTestDataManager,
  LocalFilesystem,
  ProjectContext,
} from '@recognizebv/sc3000-generator'
import {
  checkDefinitionFileExistsInCurrentDirectory,
  parseDefinitionFileInCurrentDirectory,
} from '../../datamodel/definition'
import {GeneratorLoader} from '../../generators/generator-loader'
import {parseInputs} from '../../datamodel/input-validation'
import {LockFileManager} from '@recognizebv/sc3000-generator/dist/lock-file/lock-file-manager'

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
    await checkDefinitionFileExistsInCurrentDirectory()
    const token = await this.ensureAuthenticated()

    const definition = await parseDefinitionFileInCurrentDirectory()
    const generatorLoader = new GeneratorLoader(this.environment)

    const generators = await generatorLoader.loadProjectGenerators(definition, token)
    const path = definition.workingDirectory

    const testData = new FakerTestDataManager()
    const filesystem = new LocalFilesystem(path)
    const lockFileManager = new LockFileManager(path)
    let lockFile = await lockFileManager.readLockFile()

    let projectCodeProviderInvocations = 0
    let entityCodeProviderInvocations = 0

    for (const generator of generators) {
      const {metaData, entityCodeProvider, projectCodeProvider} = generator

      const index = generators.indexOf(generator)
      const inputs = parseInputs(generator, definition.generators[index].inputs)

      try {
        const templateEngine = new EjsTemplateEngine(metaData.templateRoot)

        const context = new ProjectContext({
          project: definition.project,
          filesystem,
          templateEngine,
          testData,
          inputs,
        })

        if (!lockFileManager.hasGeneratedProjectWithGenerator(lockFile, generator)) {
          await projectCodeProvider?.render(context)
          lockFile = await lockFileManager.addGeneratedProject(lockFile, generator)
          projectCodeProviderInvocations++
        }

        for (const entity of definition.entities) {
          const entityContext = new EntityContext({
            project: definition.project,
            filesystem,
            templateEngine,
            testData,
            entity,
            inputs,
          })

          if (!lockFileManager.hasGeneratedEntityWithGenerator(lockFile, generator, entity)) {
            await entityCodeProvider?.render(entityContext)
            lockFile = await lockFileManager.addGeneratedEntity(lockFile, generator, entity)
            entityCodeProviderInvocations++
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          const message = `Something went wrong while invoking the ${metaData.name} generator.\n\n${(error as Error).message}`
          throw new Error(message)
        }

        throw error
      }
    }

    if (projectCodeProviderInvocations === 0 && entityCodeProviderInvocations === 0) {
      this.log('⚠️  No new entities or projects.')
      return
    }

    this.log(`✅  Generated ${projectCodeProviderInvocations} projects and ${entityCodeProviderInvocations} entities.`)
  }
}
