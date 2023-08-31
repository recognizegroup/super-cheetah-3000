import {RelationshipParity} from '../enums/relationship-parity'
import {Entity} from './entity'

export interface Relationship {
    parity: RelationshipParity;
    target: Entity;
    mappedBy?: string;
    inverse?: string;
}
