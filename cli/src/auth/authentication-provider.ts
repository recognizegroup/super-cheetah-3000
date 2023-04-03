import {TokenResponse} from './token-response'

export interface AuthenticationProvider {
  login(): Promise<TokenResponse>
  refresh(token: TokenResponse): Promise<TokenResponse>
}
