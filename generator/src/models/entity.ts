import {Field} from './field'
import {Operations} from './operations'

export interface Entity {
    name: string;
    operations?: Operations;
    fields: Field[];
}
