export interface TokenResponse {
  accessToken: string;
  idToken: string;
  expiresOn: Date | string;
  refreshToken: string;
  username: string;
}
