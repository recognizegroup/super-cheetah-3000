import {Context} from './context'
import {Infrastructure} from '../models/infrastructure'
import {Project} from '../models/project'
import {Filesystem} from '../io/filesystem'
import {TestDataManager} from '../test-data/test-data-manager'
import {IncrementalDataHandler} from '../templating/incremental-data-handler'
import {SecurityConfiguration} from '../models/security-configuration'

export class InfrastructureContext extends Context {
  private _infrastructure!: Infrastructure;

  constructor(object: { project: Project, filesystem: Filesystem, testData: TestDataManager, infrastructure: Infrastructure, incrementalDataHandler: IncrementalDataHandler, securityConfiguration?: SecurityConfiguration, inputs: Record<string, unknown> }) {
    super(object)
    this.infrastructure = object.infrastructure
  }

  get infrastructure(): Infrastructure {
    return this._infrastructure
  }

  public set infrastructure(infrastructure: Infrastructure) {
    this._infrastructure = infrastructure
  }

  buildVariables(): { [p: string]: any } {
    return {
      ...super.buildVariables(),
      infrastructure: this.infrastructure,
    }
  }
}
