import {ux} from '@oclif/core'
import {BaseCommand} from '../base'
import chalk from 'chalk'

export default class Login extends BaseCommand {
  static description = 'Login to the generator registries using Azure AD authentication.'

  static examples = [
    `$ sc3000 login

$ sc3000 login
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    // Device login using the Azure AD device authentication flow
    ux.log('Please login to the generator registries using Azure AD authentication.')

    const loginResult = await this.authenticationProvider.login()

    // Store the login result in the local config
    const config = await this.configProvider.retrieveConfig()
    config.authentication = loginResult

    await this.configProvider.storeConfig(config)

    ux.log(chalk.green(`Login successful. You are now logged in as ${loginResult.username}`))
  }
}
