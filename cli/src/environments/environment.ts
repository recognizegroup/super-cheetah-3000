export interface Environment {
  type: EnvironmentType;
  registryLoginClientId: string;
  registryLoginAuthority: string;
  registryUrl: string;
}

export enum EnvironmentType {
  PRD = 'prd',
  TST = 'tst',
}
