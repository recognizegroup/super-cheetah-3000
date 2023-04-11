import {TokenResponse} from './token-response'

export abstract class AuthenticationProvider {
  abstract login(): Promise<TokenResponse>
  abstract refresh(token: TokenResponse): Promise<TokenResponse>

  isExpired(token: TokenResponse): boolean {
    const expires = typeof token.expiresOn === 'string' ? new Date(token.expiresOn) : token.expiresOn

    return expires < new Date()
  }

  async fetchTokenOrRefresh(token: TokenResponse): Promise<TokenResponse> {
    if (this.isExpired(token)) {
      return this.refresh(token)
    }

    return token
  }
}
