import {IdentityProviderType} from './identity-provider-type'

export interface IdentityProviderConfiguration {
  type: IdentityProviderType
  properties: Record<string, string>
}
