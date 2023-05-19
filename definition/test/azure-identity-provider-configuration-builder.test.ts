import {AzureIdentityProviderConfigurationBuilder} from '../src/azure-identity-provider-configuration-builder'
import {expect} from 'chai'

describe('azure identity provider configuration builder', () => {
  let builder: AzureIdentityProviderConfigurationBuilder

  beforeEach(() => {
    builder = new AzureIdentityProviderConfigurationBuilder()
  })

  it('should set the tenantId property', () => {
    const tenantId = '123456789'
    builder.withTenantId(tenantId)
    expect(builder.properties.tenantId).to.equal(tenantId)
  })

  it('should return the instance of AzureIdentityProviderConfigurationBuilder', () => {
    const tenantId = '123456789'
    const result = builder.withTenantId(tenantId)
    expect(result).to.equal(builder)
  })

  it('should set the clientId property', () => {
    const clientId = '987654321'
    builder.withClientId(clientId)
    expect(builder.properties.clientId).to.equal(clientId)
  })

  it('should return the instance of AzureIdentityProviderConfigurationBuilder', () => {
    const clientId = '987654321'
    const result = builder.withClientId(clientId)
    expect(result).to.equal(builder)
  })
})
