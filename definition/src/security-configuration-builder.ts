import {IdentityProviderConfiguration, Role, SecurityConfiguration} from '@recognizebv/sc3000-generator'

export class SecurityConfigurationBuilder implements SecurityConfiguration {
  public identityProvider?: IdentityProviderConfiguration
  public roles: Role[] = []

  public addRole(name: string): SecurityConfigurationBuilder {
    this.roles.push(name)

    return this
  }

  public withIdentityProvider(identityProvider: IdentityProviderConfiguration): SecurityConfigurationBuilder {
    this.identityProvider = identityProvider
    return this
  }
}
