import {CodeProvider} from './code-provider'
import {EntityContext} from '../context/entity-context'
import {IncrementalDataHandler} from '../templating/incremental-data-handler'

export abstract class EntityCodeProvider extends CodeProvider<EntityContext> {
  async render(context: EntityContext): Promise<void> {
    await super.render(context)
    await this.renderIncrementalData(context.incrementalDataHandler, context)
  }

  async renderIncrementalData(incrementalDataHandler: IncrementalDataHandler, context: EntityContext): Promise<void> {
    await incrementalDataHandler.renderIncrementalData(context)
  }
}
