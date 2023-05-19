import {IdentityProviderConfigurationBuilder} from './identity-provider-configuration-builder'
import {IdentityProviderType} from '@recognizebv/sc3000-generator'

export class AzureIdentityProviderConfigurationBuilder extends IdentityProviderConfigurationBuilder {
  constructor() {
    super()
    this.type = IdentityProviderType.AZURE_AD
  }

  public withTenantId(tenantId: string): AzureIdentityProviderConfigurationBuilder {
    this.properties.tenantId = tenantId
    return this
  }

  public withClientId(clientId: string): AzureIdentityProviderConfigurationBuilder {
    this.properties.clientId = clientId
    return this
  }
}
