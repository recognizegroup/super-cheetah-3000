import {Context} from './context'
import {Entity} from '../models/entity'
import {Operations} from '../models/operations'
import {Project} from '../models/project'
import {Filesystem} from '../io/filesystem'
import {TestDataManager} from '../test-data/test-data-manager'
import {IncrementalDataHandler} from '../templating/incremental-data-handler'
import {SecurityConfiguration} from '../models/security-configuration'

export class EntityContext extends Context {
    private _entity!: Entity;

    constructor(object: { project: Project, filesystem: Filesystem, testData: TestDataManager, entity: Entity, incrementalDataHandler: IncrementalDataHandler, securityConfiguration?: SecurityConfiguration, inputs: Record<string, unknown> }) {
      super(object)
      this.entity = object.entity
    }

    get entity(): Entity {
      return this._entity
    }

    public set entity(entity: Entity) {
      const baseOperations: Operations = {
        create: {enabled: true, roles: []},
        read: {enabled: true, roles: []},
        update: {enabled: true, roles: []},
        delete: {enabled: true, roles: []},
        entity: {roles: []},
      }

      entity.operations = entity.operations ? {
        ...baseOperations,
        ...entity.operations,
      } : baseOperations

      this._entity = entity
    }

    buildVariables(): { [p: string]: any } {
      return {
        ...super.buildVariables(),
        entity: this.entity,
      }
    }
}
