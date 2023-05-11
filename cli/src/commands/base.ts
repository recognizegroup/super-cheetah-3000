import {Command} from '@oclif/core'
import {AuthenticationProvider} from '../auth/authentication-provider'
import {AzureAdAuthenticationProvider} from '../auth/azure-ad-authentication-provider'
import {Config} from '@oclif/core/lib/config'
import {ConfigProvider} from '../config/config-provider'
import {LocalConfigProvider} from '../config/local-config-provider'
import {determineEnvironmentFromChannel} from '../util/environment'
import {Environment} from '../environments/environment'
import {CommandError} from '@oclif/core/lib/interfaces'
import chalk from 'chalk'
import {TokenResponse} from '../auth/token-response'

export abstract class BaseCommand extends Command {
  protected authenticationProvider: AuthenticationProvider
  protected configProvider: ConfigProvider
  protected environment: Environment

  constructor(argv: string[], config: Config) {
    super(argv, config)

    this.environment = determineEnvironmentFromChannel(config.channel)
    this.authenticationProvider = new AzureAdAuthenticationProvider(this.environment)
    this.configProvider = new LocalConfigProvider(config.configDir)
  }

  protected async ensureAuthenticated(): Promise<TokenResponse> {
    const config = await this.configProvider.retrieveConfig()
    const token = config.authentication

    if (!token) {
      throw new Error('Not authenticated. In order to use this command, you must be authenticated. Please run `sc3000 login`.')
    }

    // If the token is expired, check if it can be refreshed
    try {
      config.authentication = await this.authenticationProvider.fetchTokenOrRefresh(token)
      await this.configProvider.storeConfig(config)

      return config.authentication
    } catch (error) {
      config.authentication = undefined
      await this.configProvider.storeConfig(config)

      throw new Error(`Unable to refresh token ${(error as Error).message}. In order to use this command, you must be authenticated. Please run \`sc3000 login\`.`)
    }
  }

  protected async catch(err: CommandError): Promise<any> {
    this.log(chalk.red(`❌  ${err.message}`))
  }
}
