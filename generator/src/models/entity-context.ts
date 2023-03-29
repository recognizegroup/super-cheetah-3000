import { Context } from "./context";
import { Entity } from "./entity";

export interface EntityContext extends Context {
    entity: Entity;
}