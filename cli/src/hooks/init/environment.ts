import {Hook, ux} from '@oclif/core'
import chalk from 'chalk'
import {determineEnvironmentFromChannel} from '../../util/environment'
import {EnvironmentType} from '../../environments/environment'

const hook: Hook<'init'> = async function ({config}) {
  const environment = determineEnvironmentFromChannel(config.channel)

  if (environment.type !== EnvironmentType.PRD) {
    ux.log(chalk.bgYellow.black(`[WARNING] You are using the ${environment.type} channel. Note, that this changes the location of the generator registry as well.`))
  }
}

export default hook
