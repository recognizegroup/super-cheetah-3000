import {Config} from './config'

export interface ConfigProvider {
  retrieveConfig(): Promise<Config>
  storeConfig(config: Config): Promise<void>
}
