import {expect, test} from '@oclif/test'
import * as azureAdAuth from '../../../src/auth/azure-ad-authentication-provider'
import {TokenResponse} from '../../../src/auth/token-response'
import {SinonStub, stub} from 'sinon'
import {AzureAdAuthenticationProvider} from '../../../src/auth/azure-ad-authentication-provider'
import {LocalConfigProvider} from '../../../src/config/local-config-provider'

describe('login', () => {
  const stubTokenResponse: TokenResponse = {
    accessToken: 'sample-access-token',
    idToken: 'sample-id-token',
    expiresOn: new Date(),
    refreshToken: 'sample-refresh-token',
    username: 'j.doe@recognize.nl',
  }

  let loginStub: SinonStub
  let configProviderStub: SinonStub

  beforeEach(() => {
    loginStub = stub(AzureAdAuthenticationProvider.prototype, 'login').callsFake(async () => stubTokenResponse)
    configProviderStub = stub(LocalConfigProvider.prototype, 'storeConfig').callsFake(async () => {})
  })

  afterEach(() => {
    loginStub.restore()
    configProviderStub.restore()
  })

  test
  .stdout()
  .command(['login'])
  .stub(azureAdAuth, 'AzureAdAuthenticationProvider', () => ({
    login: () => {
      return stubTokenResponse
    },
  }))
  .it('runs login command', ctx => {
    expect(ctx.stdout).to.contain('Login successful. You are now logged in as j.doe@recognize.nl')
    expect(configProviderStub.calledOnceWith({authentication: stubTokenResponse})).to.be.true
  })
})
