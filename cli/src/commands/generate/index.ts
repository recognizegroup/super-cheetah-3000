import {Flags} from '@oclif/core'
import {BaseCommand} from '../base'
import {
  EntityContext,
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
import {IncrementalDataHandler} from '@recognizebv/sc3000-generator/dist/templating/incremental-data-handler'
import {CheetahLoader} from '../../loader/cheetah-loader'

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

    const loader = new CheetahLoader()

    const definition = await parseDefinitionFileInCurrentDirectory()
    const generatorLoader = new GeneratorLoader(this.environment)

    const generators = await generatorLoader.loadProjectGenerators(definition, token)
    const path = definition.workingDirectory
    const securityConfiguration = definition.securityConfiguration

    const testData = new FakerTestDataManager()
    const filesystem = new LocalFilesystem(path)
    const lockFileManager = new LockFileManager(path)
    const incrementalDataHandler = new IncrementalDataHandler(lockFileManager, filesystem)
    let lockFile = await lockFileManager.readLockFile()

    incrementalDataHandler.loadFromLockFile(lockFile)

    let projectCodeProviderInvocations = 0
    let entityCodeProviderInvocations = 0

    await loader.start()

    for (const generator of generators) {
      const {metaData, entityCodeProvider, projectCodeProvider} = generator

      const index = generators.indexOf(generator)
      const inputs = parseInputs(generator, definition.generators[index].inputs)

      try {
        const context = new ProjectContext({
          project: definition.project,
          filesystem,
          testData,
          incrementalDataHandler,
          securityConfiguration,
          inputs,
        })

        if (!await lockFileManager.hasGeneratedProjectWithGenerator(generator)) {
          await projectCodeProvider?.render(context)
          lockFile = await lockFileManager.addGeneratedProject(generator)
          projectCodeProviderInvocations++
        }

        for (const entity of definition.entities) {
          const entityContext = new EntityContext({
            project: definition.project,
            filesystem,
            testData,
            entity,
            incrementalDataHandler,
            securityConfiguration,
            inputs,
          })

          if (!await lockFileManager.hasGeneratedEntityWithGenerator(generator, entity)) {
            await entityCodeProvider?.render(entityContext)
            lockFile = await lockFileManager.addGeneratedEntity(generator, entity)
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

    await loader.stop()

    if (projectCodeProviderInvocations === 0 && entityCodeProviderInvocations === 0) {
      this.log('⚠️  No new entities or projects.')
      return
    }

    this.log(`✅  Generated ${projectCodeProviderInvocations} projects and ${entityCodeProviderInvocations} entities.`)
  }
}
