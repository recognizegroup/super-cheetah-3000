import {expect, test} from '@oclif/test'
import * as environment from '../../../src/util/environment'
import {Environment, EnvironmentType} from '../../../src/environments/environment'

describe('hooks', () => {
  test
  .stdout()
  .stub(environment, 'determineEnvironmentFromChannel', () => ({type: EnvironmentType.TST} as Environment))
  .hook('init', {id: 'environment'})
  .do(output => expect(output.stdout).to.contain('[WARNING] You are using the tst channel. Note, that this changes the location of the generator registry as well.'))
  .it('shows a warning when using a non-production environment')

  test
  .stdout()
  .stub(environment, 'determineEnvironmentFromChannel', () => ({type: EnvironmentType.PRD} as Environment))
  .hook('init', {id: 'environment'})
  .do(output => expect(output.stdout).not.to.contain('[WARNING]`'))
  .it('does not shows a warning when using a production environment')
})
