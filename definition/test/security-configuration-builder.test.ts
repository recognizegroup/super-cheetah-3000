import {SecurityConfigurationBuilder} from '../src/security-configuration-builder'
import {expect} from 'chai'
import {IdentityProviderConfiguration, IdentityProviderType} from '@recognizebv/sc3000-generator'

describe('security configuration builder', () => {
  let builder: SecurityConfigurationBuilder

  beforeEach(() => {
    builder = new SecurityConfigurationBuilder()
  })

  it('should add a role to the roles array', () => {
    const roleName = 'admin'
    builder.addRole(roleName)
    expect(builder.roles).to.deep.include(roleName)
  })

  it('should return the instance of SecurityConfigurationBuilder', () => {
    const roleName = 'admin'
    const result = builder.addRole(roleName)
    expect(result).to.equal(builder)
  })

  it('should set the identityProvider property', () => {
    const identityProvider: IdentityProviderConfiguration = {type: IdentityProviderType.AZURE_AD, properties: {clientId: '123', clientSecret: 'secret'}}
    builder.withIdentityProvider(identityProvider)
    expect(builder.identityProvider).to.deep.equal(identityProvider)
  })

  it('should return the instance of SecurityConfigurationBuilder', () => {
    const identityProvider: IdentityProviderConfiguration = {type: IdentityProviderType.AZURE_AD, properties: {clientId: '123', clientSecret: 'secret'}}
    const result = builder.withIdentityProvider(identityProvider)
    expect(result).to.equal(builder)
  })
})
