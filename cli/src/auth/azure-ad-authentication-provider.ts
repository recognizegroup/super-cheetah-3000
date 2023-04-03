import {AuthenticationProvider} from './authentication-provider'
import * as msal from '@azure/msal-node'
import {IPublicClientApplication} from '@azure/msal-node'
import {TokenResponse} from './token-response'
import {ux} from '@oclif/core'
import {DeviceCodeResponse} from '@azure/msal-common'
import {Environment} from '../environments/environment'

export class AzureAdAuthenticationProvider implements AuthenticationProvider {
  constructor(private environment: Environment) {}

  private configuration = {
    auth: {
      clientId: this.environment.registryLoginClientId,
      authority: this.environment.registryLoginAuthority,
    },
  }

  async login(): Promise<TokenResponse> {
    const client = this.buildClient()

    client.clearCache()

    const result = await client.acquireTokenByDeviceCode({
      scopes: [`${this.configuration.auth.clientId}/.default`],
      deviceCodeCallback: (response: DeviceCodeResponse) => {
        ux.log(response.message)
        ux.action.start('Waiting for authentication...')
      },
    })

    ux.action.stop()

    if (!result) {
      throw new Error('No result returned from Azure AD authentication.')
    }

    // Refresh token is not returned by the Azure AD authentication flow, but retrieved from cache
    const refreshToken = this.extractRefreshTokenFromCache(client)

    client.clearCache()

    return {
      accessToken: result.accessToken,
      idToken: result.idToken,
      expiresOn: result.expiresOn!,
      refreshToken: refreshToken,
      username: result.account?.username ?? '',
    }
  }

  async refresh(token: TokenResponse): Promise<TokenResponse> {
    const client = this.buildClient()

    const result = await client.acquireTokenByRefreshToken({
      scopes: [`${this.configuration.auth.clientId}/.default`],
      refreshToken: token.refreshToken,
      forceCache: true,
    })

    if (!result) {
      throw new Error('No result returned from Azure AD authentication.')
    }

    // Refresh token is not returned by the Azure AD authentication flow, but retrieved from cache
    const refreshToken = this.extractRefreshTokenFromCache(client)

    client.clearCache()

    return {
      accessToken: result.accessToken,
      idToken: result.idToken,
      expiresOn: result.expiresOn!,
      refreshToken: refreshToken,
      username: result.account?.username ?? '',
    }
  }

  private extractRefreshTokenFromCache(client: IPublicClientApplication) {
    const serialized = client.getTokenCache().serialize()
    const refreshTokenObject = JSON.parse(serialized).RefreshToken

    return refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret
  }

  protected buildClient(): IPublicClientApplication {
    return new msal.PublicClientApplication(this.configuration)
  }
}
