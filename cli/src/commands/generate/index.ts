import {Flags, ux} from '@oclif/core'
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
import {DefaultLoader} from '../../loader/default-loader'
import chalk from 'chalk'

export default class Generate extends BaseCommand {
  static description = 'Generate all project files according to the current project model.'

  static examples = [
    `$ sc3000 generate

$ sc3000 generate --force
`,
  ]

  static flags = {
    force: Flags.boolean({char: 'f', description: 'Overwrite any existing files during the generation process.', required: false}),
    'super-secret-loader': Flags.boolean({description: 'Use the super secret loader.', required: false}),
  }

  async run(): Promise<void> {
    await checkDefinitionFileExistsInCurrentDirectory()
    const token = await this.ensureAuthenticated()

    const {flags} = await this.parse(Generate)
    const loader = flags['super-secret-loader'] ? new CheetahLoader() : new DefaultLoader()

    await loader.start()
    await loader.update('Loading definition file')

    const definition = await parseDefinitionFileInCurrentDirectory()
    const generatorLoader = new GeneratorLoader(this.environment)

    await loader.update('Fetching generators')

    const generators = await generatorLoader.loadProjectGenerators(definition, token)
    const path = definition.workingDirectory
    const securityConfiguration = definition.securityConfiguration

    const testData = new FakerTestDataManager()
    const filesystem = new LocalFilesystem(path)
    const lockFileManager = new LockFileManager(path)
    const incrementalDataHandler = new IncrementalDataHandler(lockFileManager, filesystem)

    await loader.update('Read lockfile')
    let lockFile = await lockFileManager.readLockFile()

    incrementalDataHandler.loadFromLockFile(lockFile)

    let projectCodeProviderInvocations = 0
    let entityCodeProviderInvocations = 0

    for (const generator of generators) {
      const {metaData, entityCodeProvider, projectCodeProvider} = generator
      await loader.update(`Checking generator state for ${metaData.name}`)

      const index = generators.indexOf(generator)
      const inputs = parseInputs(generator, definition.generators[index].inputs)

      projectCodeProvider?.renderer?.setFileExistsConfirmation(this.fileExistsConfirmation.bind(this))
      entityCodeProvider?.renderer?.setFileExistsConfirmation(this.fileExistsConfirmation.bind(this))

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
          await loader.update(`Generating project structure with ${metaData.name}`)

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
            await loader.update(`Generating entity ${entity.name} with ${metaData.name}`)

            await entityCodeProvider?.render(entityContext)
            lockFile = await lockFileManager.addGeneratedEntity(generator, entity)
            entityCodeProviderInvocations++
          }
        }
      } catch (error) {
        await loader.stop()

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

  public async fileExistsConfirmation(path: string): Promise<boolean> {
    const {flags} = await this.parse(Generate)

    if (flags.force) {
      return true
    }

    return ux.confirm(
      chalk.bgBlue(
        chalk.white(`File ${path} already exists. Overwrite? [Y/n]`),
      ),
    )
  }
}
