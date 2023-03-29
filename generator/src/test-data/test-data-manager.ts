import { Entity } from "../models/entity";

export interface TestDataManager {
    fetchTestDataForEntity(entity: Entity, seed: number): Record<typeof entity.fields[number]['name'], any>;
}