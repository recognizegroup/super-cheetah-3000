import {Generator, ProjectDefinition} from '@recognizebv/sc3000-generator'
import {Environment} from '../environments/environment'
import {join} from 'node:path'
import {existsSync} from 'node:fs'
import {mkdir} from 'node:fs/promises'
import {exec} from '../util/command-wrapper'
import {rm} from 'node:fs/promises'
import {TokenResponse} from '../auth/token-response'
import * as temp from 'temp'
import {symlink} from 'node:fs/promises'

export class GeneratorLoader {
  constructor(private environment: Environment) {}

  public async loadProjectGenerators(definition: ProjectDefinition, token: TokenResponse): Promise<Generator[]> {
    const generators = definition.generators
    const generatorDirectory = temp.mkdirSync('sc3000-generator')

    // Create a symlink between the node_modules folder of the CLI and the node_modules folder of the project
    // This is needed because the CLI uses the TypeScript compiler from its own node_modules folder, but the
    // definition file might import from the project's node_modules folder
    const cliNodeModules = join(__dirname, '..', '..', 'node_modules')
    const outputNodeModules = join(generatorDirectory, 'node_modules')

    // Create a symlink between cliNodeModules and outputNodeModules
    await symlink(cliNodeModules, outputNodeModules, 'dir')

    // If the generator directory does exists, remove it
    if (existsSync(generatorDirectory)) {
      await rm(generatorDirectory, {recursive: true})
    }

    await mkdir(generatorDirectory)

    await exec('npm init -y', {
      cwd: generatorDirectory,
    })

    const npmRcContent = `//${this.environment.registryUrl}/:_authToken=${token.accessToken}`
    await exec(`echo '${npmRcContent}' > .npmrc`, {
      cwd: generatorDirectory,
    })

    const result = [] as Generator[]

    // For every generator, install it by running `npm install <generator>`
    // Then, load the generator by importing it
    for (const generator of generators) {
      const packageLocation = generator.packageLocation

      // Check if the packageLocation seems to be a valid npm package name, both scoped and unscoped
      const scopedMatch = packageLocation.match(/^@[^/]+\/[^/]+$/)
      const unscopedMatch = packageLocation.match(/^[^/]+$/)

      let GeneratorClass: any

      if (!scopedMatch && !unscopedMatch) {
        const path = join(definition.workingDirectory, packageLocation)
        GeneratorClass = (await import(path)).default
      } else {
        await exec(`npm install ${packageLocation}@${generator.version} --registry=https://${this.environment.registryUrl}`, {
          cwd: generatorDirectory,
        })

        // Now, load the generator by importing it
        GeneratorClass = (await import(join(generatorDirectory, 'node_modules', packageLocation))).default
      }

      const instance = new GeneratorClass() as Generator
      result.push(instance)
    }

    return result
  }
}
