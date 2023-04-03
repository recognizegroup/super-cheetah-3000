export interface TokenResponse {
  accessToken: string;
  idToken: string;
  expiresOn: Date;
  refreshToken: string;
  username: string;
}
