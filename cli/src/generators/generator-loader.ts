import {Generator, ProjectDefinition} from '@recognizebv/sc3000-generator'
import {Environment} from '../environments/environment'
import {join} from 'node:path'
import {existsSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
import {exec} from '../util/command-wrapper'
import {rm} from 'node:fs/promises'
import {TokenResponse} from '../auth/token-response'
import * as temp from 'temp'

export class GeneratorLoader {
  constructor(private environment: Environment) {}

  public async loadProjectGenerators(definition: ProjectDefinition, token: TokenResponse): Promise<Generator[]> {
    const generators = definition.generators
    const generatorDirectory = temp.mkdirSync('sc3000-generator')

    // If the generator directory does exists, remove it
    if (existsSync(generatorDirectory)) {
      await rm(generatorDirectory, {recursive: true})
    }

    await mkdir(generatorDirectory)

    await exec('npm init -y', {
      cwd: generatorDirectory,
    })

    const npmRcContent = `//${this.environment.registryUrl}/:_authToken=${token.accessToken}`

    await writeFile(join(generatorDirectory, '.npmrc'), npmRcContent)

    const result = [] as Generator[]

    await exec('npm install @recognizebv/sc3000-generator@latest --prefer-offline --no-audit --progress=false', {
      cwd: generatorDirectory,
    })

    // For every generator, install it by running `npm install <generator>`
    // Then, load the generator by importing it
    for (const generator of generators) {
      const packageLocation = generator.packageLocation

      // Check if the packageLocation seems to be a valid npm package name, both scoped and unscoped
      const scopedMatch = packageLocation.match(/^@[^/\\]+\/[^/\\]+$/)
      const unscopedMatch = packageLocation.match(/^[^/\\]+$/)

      let GeneratorClass: any

      if (!scopedMatch && !unscopedMatch) {
        const path = join(definition.workingDirectory, packageLocation)
        GeneratorClass = (await import(path)).default
      } else {
        await exec(`npm install ${packageLocation}@${generator.version} --registry=https://${this.environment.registryUrl} --prefer-offline --no-audit --progress=false`, {
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
