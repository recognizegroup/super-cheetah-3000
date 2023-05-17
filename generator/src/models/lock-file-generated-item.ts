import {Entity} from './entity'

export interface LockFileGeneratedItem {
  generator: string;
  entities?: Entity[];
  project?: true;
}
