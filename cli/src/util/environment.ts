import tst from '../environments/settings/tst'
import prd from '../environments/settings/prd'
import {Environment} from '../environments/environment'

export const determineEnvironmentFromChannel = (channel: string): Environment => {
  switch (channel) {
  case 'beta':
    return tst
  case 'stable':
  default:
    return prd
  }
}
