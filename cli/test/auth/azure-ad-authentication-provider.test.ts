import {SinonStub, stub} from 'sinon'
import {expect} from 'chai'
import {TokenResponse} from '../../src/auth/token-response'
import {AzureAdAuthenticationProvider} from '../../src/auth/azure-ad-authentication-provider'
import tst from '../../src/environments/settings/tst'
import {AuthenticationResult, PublicClientApplication, TokenCache} from '@azure/msal-node'
import {AuthenticationProvider} from '../../src/auth/authentication-provider'

describe('azure ad authentication provider', () => {
  let provider: AuthenticationProvider
  let acquireDeviceCodeTokenStub: SinonStub
  let acquireTokenByRefreshTokenStub: SinonStub
  let tokenCacheStub: SinonStub

  const mockedTokenResult = {
    accessToken: 'test',
    idToken: 'test',
    expiresOn: new Date(),
    account: {
      username: 'test',
    },
  } as AuthenticationResult

  beforeEach(() => {
    provider = new AzureAdAuthenticationProvider(tst)
    acquireDeviceCodeTokenStub = stub(PublicClientApplication.prototype, 'acquireTokenByDeviceCode').callsFake(async () => mockedTokenResult)
    acquireTokenByRefreshTokenStub = stub(PublicClientApplication.prototype, 'acquireTokenByRefreshToken').callsFake(async () => mockedTokenResult)
    tokenCacheStub = stub(TokenCache.prototype, 'serialize').returns(JSON.stringify({
      RefreshToken: {
        0: {
          secret: 'test',
        },
      },
    }))
  })

  afterEach(() => {
    acquireDeviceCodeTokenStub.restore()
    acquireTokenByRefreshTokenStub.restore()
    tokenCacheStub.restore()
  })

  describe('login', () => {
    it('should throw an error when Azure AD login fails', async () => {
      acquireDeviceCodeTokenStub.resolves(null)

      // Call the login method and expect an error
      try {
        await provider.login()
        expect.fail('Expected an error')
      } catch (error) {
        expect((error as Error).message).to.equal('No result returned from Azure AD authentication.')
      }
    })

    it('should return a token response when Azure AD login succeeds', async () => {
      const tokenResponse = await provider.login()

      expect(tokenResponse).to.not.be.null
      expect(tokenResponse.accessToken).to.equal('test')
      expect(tokenResponse.idToken).to.equal('test')
      expect(tokenResponse.expiresOn).to.not.be.null
      expect(tokenResponse.refreshToken).to.equal('test')
      expect(tokenResponse.username).to.equal('test')
    })
  })

  describe('refresh token', () => {
    const stubTokenResponse: TokenResponse = {
      accessToken: 'sample-access-token',
      idToken: 'sample-id-token',
      expiresOn: new Date(),
      refreshToken: 'sample-refresh-token',
      username: 'j.doe@recognize.nl',
    }

    it('should throw an error when Azure AD login fails', async () => {
      acquireTokenByRefreshTokenStub.resolves(null)

      // Call the login method and expect an error
      try {
        await provider.refresh(stubTokenResponse)
        expect.fail('Expected an error')
      } catch (error) {
        expect((error as Error).message).to.equal('No result returned from Azure AD authentication.')
      }
    })

    it('should return a token response when Azure AD login succeeds', async () => {
      const tokenResponse = await provider.refresh(stubTokenResponse)

      expect(tokenResponse).to.not.be.null
      expect(tokenResponse.accessToken).to.equal('test')
      expect(tokenResponse.idToken).to.equal('test')
      expect(tokenResponse.expiresOn).to.not.be.null
      expect(tokenResponse.refreshToken).to.equal('test')
      expect(tokenResponse.username).to.equal('test')
    })
  })

  describe('is expired', () => {
    it('should return true if the token has already expired', () => {
      const expiredToken: TokenResponse = {
        accessToken: 'expired_access_token',
        idToken: 'id_token',
        expiresOn: new Date('2022-01-01T00:00:00Z'),
        refreshToken: 'refresh_token',
        username: 'user',
      }

      const result = provider.isExpired(expiredToken)

      expect(result).to.be.true
    })

    it('should return false if the token has not yet expired', () => {
      const notExpiredToken: TokenResponse = {
        accessToken: 'not_expired_access_token',
        idToken: 'id_token',
        expiresOn: new Date('2024-01-01T00:00:00Z'),
        refreshToken: 'refresh_token',
        username: 'user',
      }

      const result = provider.isExpired(notExpiredToken)

      expect(result).to.be.false
    })
  })

  describe('fetch token or refresh', () => {
    let refreshStub: SinonStub

    beforeEach(() => {
      refreshStub = stub(provider, 'refresh')
    })

    afterEach(() => {
      refreshStub.restore()
    })

    it('should return the token if it has not yet expired', async () => {
      const notExpiredToken: TokenResponse = {
        accessToken: 'not_expired_access_token',
        idToken: 'id_token',
        expiresOn: new Date('2024-01-01T00:00:00Z'),
        refreshToken: 'refresh_token',
        username: 'user',
      }

      const result = await provider.fetchTokenOrRefresh(notExpiredToken)

      expect(result).to.deep.equal(notExpiredToken)
      expect(refreshStub.callCount).to.equal(0)
    })

    it('should refresh the token if it has already expired', async () => {
      const expiredToken: TokenResponse = {
        accessToken: 'expired_access_token',
        idToken: 'id_token',
        expiresOn: new Date('2022-01-01T00:00:00Z'),
        refreshToken: 'refresh_token',
        username: 'user',
      }
      const refreshedToken: TokenResponse = {
        accessToken: 'refreshed_access_token',
        idToken: 'id_token',
        expiresOn: new Date('2024-01-01T00:00:00Z'),
        refreshToken: 'refresh_token',
        username: 'user',
      }

      refreshStub.resolves(refreshedToken)

      const result = await provider.fetchTokenOrRefresh(expiredToken)

      expect(result).to.deep.equal(refreshedToken)
      expect(refreshStub.callCount).to.equal(1)
      expect(refreshStub.getCall(0).args).to.deep.equal([expiredToken])
    })
  })
})
