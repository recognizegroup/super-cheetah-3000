import {DatabaseType} from '../enums/database-type'

export interface Database {
  type: DatabaseType;
  name: string;
}
