import {Entity} from './entity'
import {Infrastructure} from './infrastructure'

export interface LockFileGeneratedItem {
  generator: string;
  entities?: Entity[];
  project?: true;
  infrastructure?: Infrastructure;
}
