import {Role} from './role'

export interface Operations {
  create: { enabled: boolean; roles: Role[] };
  read: { enabled: boolean; roles: Role[] };
  update: { enabled: boolean; roles: Role[] };
  delete: { enabled: boolean; roles: Role[] }
  entity: { roles: Role[] }
}
