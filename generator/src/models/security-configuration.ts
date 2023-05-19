import {IdentityProviderConfiguration} from './identity-provider-configuration'
import {Role} from './role'

export interface SecurityConfiguration {
  identityProvider?: IdentityProviderConfiguration
  roles: Role[]
}
