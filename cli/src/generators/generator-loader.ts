import {Generator, ProjectDefinition} from '@recognizebv/sc3000-generator'
import {Environment} from '../environments/environment'
import {join} from 'node:path'
import {existsSync} from 'node:fs'
import {mkdir} from 'node:fs/promises'
import {exec} from '../util/command-wrapper'
import {rm} from 'node:fs/promises'
import {TokenResponse} from '../auth/token-response'

export class GeneratorLoader {
  constructor(private environment: Environment) {}

  public async loadProjectGenerators(definition: ProjectDefinition, token: TokenResponse): Promise<Generator[]> {
    const generators = definition.generators
    const generatorDirectory = join(__dirname, '../../tmp/generators')

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
      const generatorName = generator.packageName

      await exec(`npm install ${generatorName} --registry=https://${this.environment.registryUrl}`, {
        cwd: generatorDirectory,
      })

      // Now, load the generator by importing it
      const {default: GeneratorClass} = await import(join(generatorDirectory, 'node_modules', generatorName))
      const instance = new GeneratorClass() as Generator

      result.push(instance)
    }

    return result
  }
}
