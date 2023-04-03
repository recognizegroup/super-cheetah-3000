import {Command} from '@oclif/core'
import {AuthenticationProvider} from '../auth/authentication-provider'
import {AzureAdAuthenticationProvider} from '../auth/azure-ad-authentication-provider'
import {Config} from '@oclif/core/lib/config'
import {ConfigProvider} from '../config/config-provider'
import {LocalConfigProvider} from '../config/local-config-provider'
import {determineEnvironmentFromChannel} from '../util/environment'
import {Environment} from '../environments/environment'

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
}
