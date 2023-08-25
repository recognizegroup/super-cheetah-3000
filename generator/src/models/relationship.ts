import {RelationshipParity} from '../enums/relationship-parity'
import {Entity} from './entity'
import {Field} from './field'

export interface Relationship {
    parity: RelationshipParity;
    target: Entity;
    mappedBy?: Field;
    inverse?: Field;
}
