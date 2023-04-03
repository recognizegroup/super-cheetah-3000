import {ConfigProvider} from './config-provider'
import {Config} from './config'
import {join} from 'node:path'
import {readFile, writeFile, mkdir} from 'node:fs/promises'
import {access} from 'node:fs/promises'
import {constants} from 'node:fs'

export class LocalConfigProvider implements ConfigProvider {
  private readonly path: string

  constructor(private readonly configDir: string) {
    this.path = join(this.configDir, 'config.json')
  }

  async retrieveConfig(): Promise<Config> {
    if (!(await this.configExists())) {
      return {}
    }

    const userConfig = await readFile(this.path, 'utf8')

    return JSON.parse(userConfig) ?? {}
  }

  async storeConfig(config: Config): Promise<void> {
    // Create the config directory if it doesn't exist
    // First, check if the directory exists
    try {
      await access(this.configDir, constants.F_OK)
    } catch {
      // Directory doesn't exist, create it
      await mkdir(this.configDir)
    }

    await writeFile(this.path, JSON.stringify(config, null, 2), 'utf8')
  }

  private configExists(): Promise<boolean> {
    return access(this.path, constants.F_OK)
    .then(() => true)
    .catch(() => false)
  }
}
