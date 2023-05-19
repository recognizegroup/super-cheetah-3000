import {IdentityProviderConfiguration, IdentityProviderType} from '@recognizebv/sc3000-generator'

export abstract class IdentityProviderConfigurationBuilder implements IdentityProviderConfiguration {
  type: IdentityProviderType = IdentityProviderType.NONE
  properties: Record<string, string> = {}
}
